import bs58check from 'bs58check';
import * as MinaSDK from '@o1labs/client-sdk';

export const getNetworkFromNetworkSettings = (network, validNetworks) => {
  return validNetworks.find((networkSetting) => networkSetting.ID === network);
};

export const checkIfMinaAddressIsValid = (address) => {
  const decodedAddress = bs58check.decode(address).toString('hex');
  return !decodedAddress && !decodedAddress.length === 72;
};

export const constructSignedMinaPayment = (faucetKeypair, nonce) => {
  // TODO: Replace to, amount and fee values for what will be used in production
  const amount = 10 ** 9; // 1.0 mina -- in nanonmina (1 billion = 1.0 mina)
  const fee = 1 * 10 ** 7; // 0.01 mina -- in nanonmina (1 billion = 1.0 mina)
  const to = faucetKeypair.publicKey;
  return MinaSDK.signPayment(
    {
      from: faucetKeypair.publicKey,
      to,
      amount,
      fee,
      nonce,
    },
    faucetKeypair
  );
};

export const getInferredNonceFromErrorResponse = (errorResponse) => {
  console.log(errorResponse);
  const regexNonce = /inferred\snonce\s(\d+)/im;
  const match = errorResponse.match(regexNonce);
  return match.length > 0 ? parseInt(match[1]) : null;
};
