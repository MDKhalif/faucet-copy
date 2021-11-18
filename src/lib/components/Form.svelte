<script>
  import { createForm } from 'felte';

  import NetworkToggle from '$lib/components/NetworkToggle.svelte';
  import Button from '$lib/components/Button.svelte';
  import SuccessToast from '$lib/components/SuccessToast.svelte';
  import ErrorToast from '$lib/components/ErrorToast.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import validateAddress from '$lib/utils/validateAddress';

  import networkSettings from '../../../settings.js';

  let address = '';
  let status = 'idle';
  let paymentID = '';
  $: message = showMessageFromStatus(status);
  $: isError =
    status !== 'idle' && status !== 'loading' && status !== 'success';

  let validNetworkNames = networkSettings.validNetworks.map(({ name }) => name);
  let currentSelectedNetwork = validNetworkNames[0];

  const showMessageFromStatus = (status) => {
    switch (status) {
      case 'success':
        return 'Success. Testnet Mina will arrive at your address when the next block is produced (~3 min).';
      case 'invalid-address':
        return 'Invalid Mina address. Please verify that your address is correct.';
      case 'invalid-network':
        return 'Invalid Network. Please verify that the network you selected is correct.';
      case 'insufficient-data':
        return 'Could not read the request. Please try again.';
      case 'parse-error':
        return 'Could not parse the request. Please try again.';
      case 'rate-limit':
        return 'Maximum allowed withdrawls exceeded.';
      case 'broadcast-error':
        return 'Unknown error broadcasting to the network.';
      case 'nonce-error':
        return 'Invalid nonce on transaction. Please try again in ~3 min.';
      default:
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
            class="block tracking-wide_medium text-xs mb-2 uppercase font-mono text-mina-black-primary"
          >
            Network</span
          >
          <NetworkToggle
            items={validNetworkNames}
            bind:currentItem={currentSelectedNetwork}
          />
        </div>
      </div>
      <div class="flex flex-col w-full max-w-2xl mt-6 mr-auto">
        <label
          class="block tracking-wide_medium text-xs mb-2 uppercase font-mono text-mina-black-primary"
          for="address"
        >
          Mina Address</label
        >
        <div
          class="relative w-full flex items-stretch flex-grow focus-within:z-10"
        >
          <input
            type="text"
            id="address"
            name="address"
            class={`w-full max-w-2xl shadow-md pl-5 text-base focus:ring-border-focused-mina overflow-ellipsis
            focus:ring-opacity-70 focus:border-opacity-70 focus:border-focused-mina block rounded-sm placeholder-gray-mina-primary
             ${
               isError
                 ? 'border-error-mina text-error-mina'
                 : 'border-gray-mina-primary text-current'
             }`}
            placeholder="B62..."
            bind:value={address}
          />
        </div>
        <div class="flex flex-col sm:flex-row mt-6 w-40 sm:w-full">
          <Button {status} type={'submit'} copy={'Request'} />
          <div
            class="text-sm w-full sm:w-72 prose prose-indigo prose-lg text-black-mina-primary text-left mt-6 sm:mt-0 sm:ml-6"
          >
            Limit of 1 use per address on each network to help ensure everyone
            has access.
          </div>
        </div>
      </div>
    </form>
    <div class="flex justify-start items-center mt-4">
      {#if status === 'success'}
        <SuccessToast {message} {paymentID} />
      {:else if status === 'loading'}
        <Loader />
      {:else if isError}
        <ErrorToast {message} on:reset={() => (status = 'idle')} />
      {/if}
    </div>
  </div>
</div>
