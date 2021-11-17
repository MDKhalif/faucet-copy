<script>
  import { createForm } from 'felte';

  import CursorLogo from '/static/images/cursor-input.svg';

  import NetworkToggle from '$lib/components/NetworkToggle.svelte';
  import Button from '$lib/components/Button.svelte';
  import SuccessToast from '$lib/components/SuccessToast.svelte';
  import ErrorToast from '$lib/components/ErrorToast.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import validateAddress from '$lib/utils/validateAddress';

  import networkSettings from '../../../settings.js';

  let networkMenuOpen = false;
  let address = 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e'; // TODO: Remove this later, used for testing purposes (this is the Faucet public key)
  let status = 'idle';
  let paymentID = '';
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
      case 'nonce-error':
        return 'Unknown error broadcasting to the network. Please try again in ~3 min.';
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
      paymentID = faucetResponseJSON?.message?.paymentID
        ? faucetResponseJSON.message.paymentID
        : '';
    },
  });
</script>

<div class="bg-white flex justify-center items-center mt-8">
  <div class="w-full mr-auto">
    <form
      use:form
      on:submit|preventDefault
      class="sm:flex sm:items-center flex-col"
    >
      <div class="flex justify-start items-center w-full mr-auto">
        <div class="flex flex-col ">
          <span
            class="block text-gray-700 tracking-wide_medium text-xs mb-2 uppercase"
          >
            Network</span
          >
          <NetworkToggle />
        </div>
      </div>
      <div class="flex flex-col w-full max-w-2xl mt-6 mr-auto">
        <label
          class="block text-gray-700 tracking-wide_medium text-xs mb-2 uppercase"
          for="address"
        >
          Mina Address</label
        >
        <div
          class="relative w-full flex items-stretch flex-grow focus-within:z-10"
        >
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <img src={CursorLogo} alt="Cursor Logo" />
          </div>
          <input
            type="text"
            id="address"
            name="address"
            class="w-full shadow-lg pl-7 text-base focus:ring-orange-mina-primary focus:ring-opacity-70 focus:border-opacity-70 focus:border-orange-mina-primary block rounded-sm border-indigo-500"
            placeholder="B62..."
            bind:value={address}
          />
        </div>
        <div class="flex flex-col sm:flex-row mt-6">
          <Button {status} type={'submit'} copy={'Request Funds'} />
          <p
            class="text-sm w-full sm:w-1/2 prose prose-indigo prose-lg text-black-mina-primary mx-auto text-left mt-6 sm:mt-0 sm:ml-6"
          >
            Limit of 1 use per address on each network to ensure everyone has
            access to funds.
          </p>
        </div>
      </div>
    </form>
    <div class="flex justify-start items-center mt-4">
      {#if status === 'success'}
        <SuccessToast {message} {paymentID} />
      {:else if status === 'loading'}
        <Spinner />
      {:else if status !== 'idle' && status !== 'loading'}
        <ErrorToast {message} on:reset={() => (status = 'idle')} />
      {/if}
    </div>
  </div>
</div>
