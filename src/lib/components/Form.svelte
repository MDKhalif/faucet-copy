<script>
  import { createForm } from 'felte';

  import Dropdown from '$lib/components/Dropdown.svelte';
  import SuccessToast from '$lib/components/SuccessToast.svelte';
  import ErrorToast from '$lib/components/ErrorToast.svelte';
  import validateAddress from '$lib/utils/validateAddress';

  import networkSettings from '../../../settings.js';

  let networkMenuOpen = false;
  let address = 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e'; // TODO: Remove this later, used for testing purposes (this is the Faucet public key)
  let status = 'idle';
  $: message = showMessageFromStatus(status);

  let validNetworkNames = networkSettings.validNetworks.map(({ name }) => name);
  let currentSelectedNetwork = validNetworkNames[0];

  const showMessageFromStatus = (status) => {
    switch (status) {
      case 'success':
        return 'Message broadcast to the network. Testnet funds will arrive at your address when the next block is produced (~3 min).';
      case 'invalid-address':
        return 'Invalid Mina address. Please verify that your address is correct.';
      case 'invalid-network':
        return 'Invalid Network. Please verify that the network you selected is correct.';
      case 'parse-error':
        return 'Could not parse the request. Please try again.';
      case 'rate-limit':
        return 'This account was sent funds previously. Please use another Mina account.';
      case 'broadcast-error':
        return 'Unknown error broadcasting to the network.';
      case 'mina-explorer':
        return 'Unknown error. Please try again.';
    }
  };

  const { form } = createForm({
    onSubmit: async () => {
      if (!validateAddress(address)) {
        status = 'invalid-address';
        return;
      }
      // Get current selected Network settings object from specified user network
      const network = networkSettings.validNetworks.filter(
        (network) => currentSelectedNetwork === network.name
      )[0].ID;

      const faucetResponse = await fetch('/api/v1/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          address,
        }),
      });
      const faucetResponseJSON = await faucetResponse.json();
      status = faucetResponseJSON.status;
    },
  });
</script>

<div
  class="bg-white shadow sm:rounded-lg flex justify-center items-center mt-10"
>
  <div class="px-4 py-5 sm:p-6 w-full">
    <form
      use:form
      on:submit|preventDefault
      class="sm:flex sm:items-center flex-col"
    >
      <div class="flex justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <span class="block text-gray-700 text-sm font-bold mb-2">
            Testnet Network</span
          >
          <Dropdown
            bind:menuOpen={networkMenuOpen}
            bind:currentItem={currentSelectedNetwork}
            bind:items={validNetworkNames}
          />
        </div>
      </div>

      <div class="w-full sm:max-w-lg mt-20">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          Mina Address</label
        >
        <input
          type="text"
          id="address"
          name="address"
          class="shadow-sm focus:ring-black-mina-primary focus:border-black-mina-primary block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="B62..."
          bind:value={address}
        />
      </div>
      <button
        type="submit"
        class="w-full mt-12 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-orange-mina-primary hover:bg-orange-mina-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-mina-primary sm:ml-3 sm:w-auto sm:text-sm"
      >
        Request Funds
      </button>
    </form>
    <div class="flex justify-center items-center mt-4">
      {#if status === 'success'}
        <SuccessToast {message} on:reset={() => (status = 'idle')} />
      {:else if status !== 'idle'}
        <ErrorToast {message} on:reset={() => (status = 'idle')} />
      {/if}
    </div>
  </div>
</div>
