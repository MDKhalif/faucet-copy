<script>
  import Form from '$lib/components/Form.svelte';
  import MinaLogo from '/static/images/mina-logo.svg';
</script>

<div class="relative">
  <div class="flex flex-col items-center justify-center">
    <img src={MinaLogo} alt="Mina Logo" class="w-80 sm:w-72 h-full" />
    <h2
      class="text-center text-3xl leading-8 tracking-tight text-gray-900 sm:text-4xl"
    >
      Testnet Faucet
    </h2>
  </div>
  <div class="mt-24 mb-16 max-w-xl mx-auto text-center text-gray-500">
    <div>Enter a Mina address to receive testnet funds.</div>
    <div class="mt-3">
      Testnet tokens have no value, but are useful for experimenting on Mina
      testnets.
    </div>
  </div>
  <Form />
  <p class="prose prose-indigo prose-lg text-gray-500 mx-auto text-center">
    Limit of 1 use per address on each network to ensure everyone has access to
    funds.
  </p>
</div>
