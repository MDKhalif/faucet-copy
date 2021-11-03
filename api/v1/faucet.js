import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import * as MinaSDK from '@o1labs/client-sdk';
import fetch from 'node-fetch';
import bs58check from 'bs58check';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const settings = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'settings.json')));

export default async function handler(req, res) {
	const { address, network } = req.body;

	// If we cannot parse the JSON, return 400
	if (!address || !network) {
		return res.status(400).json({ status: 'parse-error' });
	}

	// If the specified network is invalid, return 400
	if (!network in settings.validNetworks) {
		console.log('Network name not specified');
		return res.status(400).json({ status: 'invalid-network' });
	}

	// If the specified address is not valid or passes the checksum, return 400
	try {
		const decodedAddress = bs58check.decode(address).toString('hex');
		if (!decodedAddress && !decodedAddress.length === 72) {
			throw 'invalid-address';
		}
	} catch (error) {
		console.log('error', error);
		return res.status(400).json({ status: 'invalid-address' });
	}

	// Apply rate limiting to previous Mina accounts if found in DB
	const entry = await prisma.entry.findUnique({
		where: {
			addressNetwork: { address: address, network: network }
		}
	});
	if (entry) {
		console.log('Previous entry for user', entry.address);
		return res.status(400).json({ status: 'rate-limit' });
	}

	// Construct a keypair object to sign a payment
	const faucetKeypair = {
		privateKey: process.env.FAUCET_PRIVATEKEY,
		publicKey: process.env.FAUCET_PUBLICKEY
	};

	// TODO: Change this endpoint to selected network
	// Get the nonce of the Faucet account
	const faucetAccountSummary = await fetch(
		`https://devnet.api.minaexplorer.com/accounts/${faucetKeypair.publicKey}`
	);
	const faucetAccountSummaryJSON = await faucetAccountSummary.json();

	if (faucetAccountSummary.status !== 200) {
		console.log('Mina Faucet Query', faucetAccountSummaryJSON);
		return res.status(400).json({ status: 'mina-explorer' });
	}

	// TODO: Replace to, amount and fee values for what will be used in production
	const amount = 10 ** 9; // 1.0 mina -- in nanonmina (1 billion = 1.0 mina)
	const fee = 1 * 10 ** 7; // 0.01 mina -- in nanonmina (1 billion = 1.0 mina)
	const to = faucetKeypair.publicKey;
	// Create a signed payment
	const signedPayment = MinaSDK.signPayment(
		{
			from: faucetKeypair.publicKey,
			to,
			amount,
			fee,
			nonce: faucetAccountSummaryJSON.account.nonce // The current nonce of the Faucet account
		},
		faucetKeypair
	);
	console.log('signedPayment', JSON.stringify(signedPayment));

	// Broadcast transaction
	const paymentResponse = await fetch(
		'https://devnet.api.minaexplorer.com/broadcast/transaction',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(signedPayment)
		}
	);
	console.log('Broadcast payment response', await paymentResponse.json());

	// Insert successful payment in DB, return 400 otherwise
	if (!paymentResponse.status === '201') {
		return res.status(400).json({ status: 'broadcast-error' });
	} else {
		await prisma.entry.create({
			data: {
				address: address,
				network: network,
				amount
			}
		});
		return res.status(200).json({
			status: 'success'
		});
	}
}