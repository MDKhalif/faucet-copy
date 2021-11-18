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

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'faucet.minaprotocol.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

export default allowCors(async function handler(req, res) {
  let address = '';
  let network = '';

  // If we cannot parse the JSON, return 400
  try {
    address = req.body.address;
    network = req.body.network;
  } catch {
    console.log(`parse-error -- req.body:{ ${req.body} }`);
    return res.status(400).json({ status: 'parse-error' });
  }
  if (!address || !network) {
    console.log(
      `insufficient-data -- network:{ ${network} } address:{ ${address} }`
    );
    return res.status(400).json({ status: 'insufficient-data' });
  }

  // If the specified network is invalid, return 400
  const specifiedNetwork = getNetworkFromNetworkSettings(
    network,
    networkSettings.validNetworks
  );
  if (!specifiedNetwork) {
    console.log(`invalid-network -- specifiedNetwork:{ ${specifiedNetwork} }`);
    return res.status(400).json({ status: 'invalid-network' });
  }

  // If the specified address is not valid, return 400
  try {
    if (!checkIfMinaAddressIsValid(address)) {
      throw 'invalid-address';
    }
  } catch (error) {
    console.log(`invalid-address -- error:{ ${String(error)} }`);
    return res.status(400).json({ status: 'invalid-address' });
  }

  // Apply rate limiting to previous Mina accounts if found in DB
  const previousEntry = await prisma.entry.findUnique({
    where: {
      addressNetwork: { address, network },
    },
  });
  if (previousEntry) {
    console.log(`rate-limit -- previousEntry:{ ${previousEntry} }`);
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
    address,
    specifiedNetwork.amount
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
    // This is in a try-finally incase users specify the same address at the same time that should be rate-limited.
    // Since the payment is successful, we return a success message even if rate-limit creation fails.
    try {
      await prisma.entry.create({
        data: {
          address: signedPayment.payload.to,
          network: specifiedNetwork.ID,
          amount: parseInt(specifiedNetwork.amount),
        },
      });
    } finally {
      const paymentResponseJSON = await paymentResponse.json();
      const paymentID = paymentResponseJSON.result.payment.hash;
      console.log(
        `success -- signedPayment:{ ${JSON.stringify(
          signedPayment
        )} } paymentID:{ ${paymentID} }`
      );
      return res.status(200).json({
        status: 'success',
        message: {
          paymentID,
        },
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
      console.log(
        `nonce-error -- currentNetworkNonce:{ ${currentNetworkNonce} } newNonce:{ ${newNonce} }`
      );
      return res.status(400).json({ status: 'nonce-error' });
    }
    console.log(
      `broadcast-error -- paymentResponseJSON:{ ${paymentResponseJSON} }`
    );
    return res.status(400).json({ status: 'broadcast-error' });
  }
});
