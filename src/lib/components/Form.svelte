<script>
	import Dropdown from '$lib/components/Dropdown.svelte';
	import SuccessToast from '$lib/components/SuccessToast.svelte';
	import ErrorToast from '$lib/components/ErrorToast.svelte';
	import validateAddress from '$lib/utils/validateAddress';
	import getValidNetworks from '$lib/utils/getValidNetworks';

	let networkMenuOpen = false;
	let address = 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e'; // TODO: Remove this later, used for testing purposes (this is the Faucet public key)
	let status = 'idle';
	let validNetworks = getValidNetworks();
	let validNetworkNames = validNetworks.map((network) => network.networkObj.name);
	let currentSelectedNetwork = validNetworkNames[0];

	const onSubmit = async () => {
		if (!validateAddress(address)) {
			status = 'invalid-address';
		} else {
			let networkEntry = Object.keys(validNetworks).find(
				(networkName) =>
					validNetworks[networkName].networkObj.name === currentSelectedNetwork
			);
			const faucetResponse = await fetch('/api/v1/faucet', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					network: validNetworks[networkEntry].networkName,
					address: address
				})
			});
			const faucetResponseJSON = await faucetResponse.json();
			status = faucetResponseJSON.status;
		}
	};
</script>

<div class="bg-white shadow sm:rounded-lg flex justify-center items-center mt-24">
	<div class="px-4 py-5 sm:p-6 w-full">
		<form on:submit|preventDefault={onSubmit} class="mt-5 sm:flex sm:items-center flex-col">
			<div class="w-full sm:max-w-lg">
				<label for="address" class="sr-only">Email</label>
				<input
					type="text"
					id="address"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					placeholder="Your Mina Address here"
					bind:value={address}
				/>
			</div>
			<div class="mt-8 flex">
				<Dropdown
					bind:menuOpen={networkMenuOpen}
					bind:currentItem={currentSelectedNetwork}
					bind:items={validNetworkNames}
				/>
				<button
					type="submit"
					class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
				>
					Request Funds
				</button>
			</div>
		</form>
		<div class="flex justify-center items-center mt-4">
			{#if status === 'success'}
				<SuccessToast
					message={'Message broadcast to network. Testnet funds will arrive at your address soon.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'invalid-address'}
				<ErrorToast
					message={'Invalid Mina Address, please verify your address is correct.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'invalid-network'}
				<ErrorToast
					message={'Invalid Network, please verify the network you selected is correct.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'parse-error'}
				<ErrorToast
					message={'Could not parse request, please try again.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'rate-limit'}
				<ErrorToast
					message={'This account was sent funds previously, please use another Mina account.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'broadcast-error'}
				<ErrorToast
					message={'Unknown error broadcasting to network.'}
					on:reset={() => (status = 'idle')}
				/>
			{:else if status === 'mina-explorer'}
				<ErrorToast
					message={'Unknown error, please try again.'}
					on:reset={() => (status = 'idle')}
				/>
			{/if}
		</div>
	</div>
</div>
