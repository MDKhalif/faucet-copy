import networkSettings from '../../../settings.json';

export default () => {
  const networks = [];
  for (const [networkName, networkObj] of Object.entries(
    networkSettings.validNetworks
  )) {
    networks.push({ networkName, networkObj });
  }
  return networks;
};
