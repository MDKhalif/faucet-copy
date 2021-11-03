export default function (address) {
  return /^(B62){1}[0-9a-zA-Z]{45,60}$$/i.test(address);
}
