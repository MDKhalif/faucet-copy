<script>
  import { createForm } from 'felte';

  import Dropdown from '$lib/components/Dropdown.svelte';
  import SuccessToast from '$lib/components/SuccessToast.svelte';
  import ErrorToast from '$lib/components/ErrorToast.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
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
      if (status === 'loading') return;
      status = 'loading';
      if (!validateAddress(address)) {
        status = 'invalid-address';
        return;
      }
      // Get current selected Network ID from the user selected network
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

  const baseButtonStyles =
    'w-full mt-12 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-orange-mina-primary hover:bg-orange-mina-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-mina-primary focus:ring-opacity-60 sm:ml-3 sm:w-auto sm:text-sm';
</script>

<div class="bg-white flex justify-center items-center mt-10">
  <div class="px-4 py-5 sm:p-6 w-full">
    <form
      use:form
      on:submit|preventDefault
      class="sm:flex sm:items-center flex-col"
    >
      <div class="flex justify-center items-center">
        <div class="flex flex-col w-full">
          <span class="block text-gray-700 text-sm font-bold mb-2">
            Network</span
          >
          <Dropdown
            bind:menuOpen={networkMenuOpen}
            bind:currentItem={currentSelectedNetwork}
            bind:items={validNetworkNames}
          />
        </div>
      </div>
      <div class="w-full sm:max-w-lg mt-6 ">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          Mina Address</label
        >
        <input
          type="text"
          id="address"
          name="address"
          class="shadow-sm focus:ring-orange-mina-primary focus:ring-opacity-60 focus:border-orange-mina-primary block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="B62..."
          bind:value={address}
        />
      </div>
      <button
        type="submit"
        class={status === 'loading'
          ? `opacity-25 ${baseButtonStyles}`
          : baseButtonStyles}
      >
        Request Funds
      </button>
    </form>
    <div class="flex justify-center items-center mt-4">
      {#if status === 'success'}
        <SuccessToast {message} />
      {:else if status === 'loading'}
        <Spinner />
      {:else if status !== 'idle' && status !== 'loading'}
        <ErrorToast {message} on:reset={() => (status = 'idle')} />
      {/if}
    </div>
  </div>
</div>
