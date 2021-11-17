<script>
  import Form from '$lib/components/Form.svelte';
  import MinaLogo from '/static/images/mina-logo.svg';
</script>

<div class="relative">
  <img
    src={MinaLogo}
    alt="Mina Logo"
    class="flex ml-auto w-80 sm:w-72 h-full"
  />
  <div class="flex flex-col items-start justify-center mt-24">
    <h2
      class="text-left text-3xl leading-8 tracking-tight text-gray-900 sm:text-5xl"
    >
      Testnet Faucet
    </h2>
  </div>
  <div
    class="mt-8 mb-8 max-w-xl text-left text-lg leading-8 text-black-mina-primary font-mono"
  >
    Enter a Mina address to receive testnet funds. Testnet tokens have no value,
    but are useful for experimenting on Mina testnets.
  </div>
  <Form />
</div>
