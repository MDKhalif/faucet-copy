import bs58check from 'bs58check';
import * as MinaSDK from '@o1labs/client-sdk';

export const getNetworkFromNetworkSettings = (network, validNetworks) => {
  return validNetworks.find((networkSetting) => networkSetting.ID === network);
};

export const checkIfMinaAddressIsValid = (address) => {
  const decodedAddress = bs58check.decode(address).toString('hex');
  return !decodedAddress && !decodedAddress.length === 72;
};

export const getFaucetNonce = async (faucetNonce, networkSettingID) => {
  if (networkSettingID === 'devnet') {
    return faucetNonce[0].devnetNonce;
  } else if (networkSettingID === 'snappsnet') {
    return faucetNonce[0].snappnetNonce;
  }
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
  const regexNonce = /inferred\snonce\s(\d+)/im;
  const match = errorResponse.error.match(regexNonce);
  console.log('match value', match);
  console.log(`Inferred Nonce: ${match[1]}`);
  return parseInt(match[1]);
};
