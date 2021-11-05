<script>
  import Form from '$lib/components/Form.svelte';
  import MinaLogo from '/static/images/mina-logo.png';
</script>

<div class="relative">
  <div class="flex flex-col items-center justify-center">
    <img src={MinaLogo} alt="Mina Logo" />
    <h2
      class="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
    >
      Mina Testnet Faucet
    </h2>
  </div>
  <p class="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
    Enter a Mina address to receive Testnet funds. Testnet tokens have no value,
    but are useful for experimenting on Mina Testnets.
  </p>
  <Form />
  <p class="prose prose-indigo prose-lg text-gray-500 mx-auto text-center">
    <i>Limit of 1 use per address on each network.</i>
  </p>
</div>
