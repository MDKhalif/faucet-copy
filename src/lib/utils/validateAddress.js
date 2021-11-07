/**
 * Checks if the user specified Mina address is valid using a regex check.
 * Check if the address starts with `B62`, only has alphanumeric characters,
 * and has a length of 55.
 * @param {string} address - A Mina address
 * @returns {boolean} True if valid otherwise false
 */
export default (address) => {
  return /^(B62){1}[0-9a-zA-Z]{52}$/i.test(address);
};
