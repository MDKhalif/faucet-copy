import dotenv from 'dotenv';
dotenv.config();

import {
  getNetworkFromNetworkSettings,
  checkIfMinaAddressIsValid,
  constructSignedMinaPayment,
  getInferredNonceFromErrorResponse,
} from './utils.js';
import networkSettings from '../../settings.js';

import fetch from 'node-fetch';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { address, network } = req.body;

  // If we cannot parse the JSON, return 400
  if (!address || !network) {
    return res.status(400).json({ status: 'parse-error' });
  }

  // If the specified network is invalid, return 400
  const specifiedNetwork = getNetworkFromNetworkSettings(
    network,
    networkSettings.validNetworks
  );
  if (!specifiedNetwork) {
    return res.status(400).json({ status: 'invalid-network' });
  }

  // If the specified address is not valid, return 400
  try {
    if (!checkIfMinaAddressIsValid(address)) {
      throw 'invalid-address';
    }
  } catch (error) {
    return res.status(400).json({ status: 'invalid-address' });
  }

  // Apply rate limiting to previous Mina accounts if found in DB
  const previousEntry = await prisma.entry.findUnique({
    where: {
      addressNetwork: { address, network },
    },
  });
  if (previousEntry) {
    return res.status(400).json({ status: 'rate-limit' });
  }

  // Construct a keypair object to sign a payment
  const faucetKeypair = {
    privateKey: process.env.FAUCET_PRIVATEKEY,
    publicKey: process.env.FAUCET_PUBLICKEY,
  };

  // Update and get the nonce of the Faucet account from DB
  // We update first to avoid race conditions between parallel executions
  let faucetNonce;
  if (specifiedNetwork.ID === 'devnet') {
    faucetNonce = (
      await prisma.faucetAccountNonce.update({
        where: {
          id: 1,
        },
        data: {
          devnetNonce: {
            increment: 1,
          },
        },
      })
    ).devnetNonce;
  } else if (specifiedNetwork.ID === 'snappsnet') {
    faucetNonce = (
      await prisma.faucetAccountNonce.update({
        where: {
          id: 1,
        },
        data: {
          snappnetNonce: {
            increment: 1,
          },
        },
      })
    ).snappnetNonce;
  }
  // Since we updated first, the actual nonce value is one less than the returned value
  const currentNetworkNonce = faucetNonce - 1;

  // Create a signed payment with the Faucet keypair and specified network and user address
  const signedPayment = constructSignedMinaPayment(
    faucetKeypair,
    currentNetworkNonce,
    address
  );

  console.log('signedPayment', signedPayment);

  // Broadcast transaction
  const paymentResponse = await fetch(
    `${specifiedNetwork.endpoint}/broadcast/transaction`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signedPayment),
    }
  );

  if (paymentResponse.status === 201) {
    // This is in a try-finally incase users specify the same address at the same time that should be rate-limited.
    // Since the payment is successful, we return a success message even if rate-limit creation fails.
    try {
      await prisma.entry.create({
        data: {
          address: signedPayment.payload.to,
          network: specifiedNetwork.ID,
          amount: parseInt(signedPayment.payload.amount),
        },
      });
    } finally {
      return res.status(200).json({
        status: 'success',
      });
    }
  } else {
    const paymentResponseJSON = await paymentResponse.json();
    const newNonce = getInferredNonceFromErrorResponse(
      paymentResponseJSON.error
    );

    // If the tracked nonce value in DB is not the same as network nonce, reset the DB nonce to the network nonce value
    if (newNonce && currentNetworkNonce !== newNonce) {
      if (specifiedNetwork.ID === 'devnet') {
        await prisma.faucetAccountNonce.update({
          where: {
            id: 1,
          },
          data: {
            devnetNonce: newNonce,
          },
        });
      } else if (specifiedNetwork.ID === 'snappsnet') {
        await prisma.faucetAccountNonce.update({
          where: {
            id: 1,
          },
          data: {
            snappnetNonce: newNonce,
          },
        });
      }
      return res.status(400).json({ status: 'nonce-error' });
    }
    return res.status(400).json({ status: 'broadcast-error' });
  }
}
