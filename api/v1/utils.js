import bs58check from 'bs58check';
import * as MinaSDK from '@o1labs/client-sdk';

/**
 * Gets the specified network settings object using the specified network value.
 *
 * @param {string} network A testnet network
 * @param {[Object]} validNetworks An array of valid network settings
 * @returns {Object | undefined} A network setting object or undefined
 */
export const getNetworkFromNetworkSettings = (network, validNetworks) => {
  return validNetworks.find((networkSetting) => networkSetting.ID === network);
};

/**
 * Checks if the specified address can be decoded in base58 and matches the
 * length of an Mina address in hex.
 *
 * @param {string} address A Mina address
 * @returns {boolean} True if address is valid otherwise false
 */
export const checkIfMinaAddressIsValid = (address) => {
  const decodedAddress = bs58check.decode(address).toString('hex');
  return !!decodedAddress && decodedAddress.length === 72;
};

/**
 * Constructs a signed payment with a keypair using defaulted values for the amount and fee.
 *
 *  TODO: Replace to, amount and fee values for what will be used in production
 *
 * @param {{publicKey: string, privateKey: string}} faucetKeypair - A Mina keypair
 * @param {Number} nonce A nonce value to be used in the payment
 * @param {string} toAddress A Mina address
 * @returns A signed Mina payment
 */
export const constructSignedMinaPayment = (
  faucetKeypair,
  nonce,
  _toAddress,
  networkAmount
) => {
  const amount = networkAmount ** 9; // 1in nanonmina (1 billion = 1.0 mina)
  const fee = 1 * 10 ** 7; // 0.01 mina -- in nanonmina (1 billion = 1.0 mina)
  const from = faucetKeypair.publicKey;
  const to = faucetKeypair.publicKey; // _toAddress
  return MinaSDK.signPayment(
    {
      from,
      to,
      amount,
      fee,
      nonce,
    },
    faucetKeypair
  );
};

/**
 * Uses regex to match the returned `inferred nonce` value from the
 * MinaExplorer `/broadcast/transaction` endpoint error response.
 *
 * @param {string} errorResponse - An error response from MinaExplorer `/broadcast/transaction` endpoint
 * @returns {number | undefined} A nonce value or undefined
 */
export const getInferredNonceFromErrorResponse = (errorResponse) => {
  const nonceRegex = /inferred\snonce\s(\d+)/im;
  const nonceMatch = errorResponse.match(nonceRegex);
  return nonceMatch.length > 0 ? parseInt(nonceMatch[1]) : null;
};
