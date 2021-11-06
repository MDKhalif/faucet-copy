import dotenv from 'dotenv';
dotenv.config();

import {
  getNetworkFromNetworkSettings,
  checkIfMinaAddressIsValid,
  getFaucetNonce,
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
    if (checkIfMinaAddressIsValid(address)) {
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

  // Get the nonce of the Faucet account from DB
  const faucetNonce = await prisma.faucetAccountNonce.findMany();
  let currentNetworkNonce = await getFaucetNonce(
    faucetNonce,
    specifiedNetwork.ID
  );

  // Create a signed payment
  const signedPayment = constructSignedMinaPayment(
    faucetKeypair,
    currentNetworkNonce
  );

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
    if (specifiedNetwork.ID === 'devnet') {
      await prisma.faucetAccountNonce.updateMany({
        data: {
          devnetNonce: {
            increment: 1,
          },
        },
      });
    } else if (specifiedNetwork.ID === 'snappsnet') {
      await prisma.faucetAccountNonce.updateMany({
        data: {
          snappnetNonce: {
            increment: 1,
          },
        },
      });
    }
    // TODO: This is commented out to test, comment back in when deploying
    // await prisma.entry.create({
    //   data: {
    //     address: signedPayment.payload.to,
    //     network: specifiedNetwork.ID,
    //     amount: parseInt(signedPayment.payload.amount),
    //   },
    // });
    return res.status(200).json({
      status: 'success',
    });
  } else {
    const paymentResponseJSON = await paymentResponse.json();
    const newNonce = getInferredNonceFromErrorResponse(
      paymentResponseJSON.error
    );

    // If the tracked nonce value in DB is not the same as network nonce, reset the DB nonce to the network nonce value
    if (newNonce && currentNetworkNonce !== newNonce) {
      if (specifiedNetwork.ID === 'devnet') {
        await prisma.faucetAccountNonce.updateMany({
          data: {
            devnetNonce: newNonce,
          },
        });
      } else if (specifiedNetwork.ID === 'snappsnet') {
        await prisma.faucetAccountNonce.updateMany({
          data: {
            snappnetNonce: newNonce,
          },
        });
      }
    }
    return res.status(400).json({ status: 'broadcast-error' });
  }
}
