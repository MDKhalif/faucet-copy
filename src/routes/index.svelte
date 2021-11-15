<script>
  import Form from '$lib/components/Form.svelte';
  import MinaLogo from '/static/images/mina-logo.svg';
</script>

<div class="relative">
  <div class="flex flex-col items-center justify-center">
    <img src={MinaLogo} alt="Mina Logo" class="w-80 md:w-96 h-full" />
    <h2
      class="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mt-10"
    >
      Mina Testnet Faucet
    </h2>
  </div>
  <div
    class="mt-24 mb-16 max-w-xl mx-auto text-center text-xl sm:text-2xl text-gray-500"
  >
    <span>Enter a Mina address to receive testnet funds.</span>
    <br />
    <span>
      Testnet tokens have no value, but are useful for experimenting on Mina
      testnets.
    </span>
  </div>
  <Form />
  <p class="prose prose-indigo prose-lg text-gray-500 mx-auto text-center">
    <i
      >Limit of 1 use per address on each network to ensure everyone has access
      to funds.</i
    >
  </p>
</div>
