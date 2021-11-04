<script>
  import Form from '$lib/components/Form.svelte';
  import MinaLogo from '/static/mina-logo.png';
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
    The Mina Testnet Faucet is a web-based service that provides users with test
    Mina to users who are participating in a testnet. These tokens have no "real
    world" value and they simply enable users to build and experiment on-top of
    the Mina Testnet.
  </p>
  <div
    class="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto text-center"
  >
    <p class="text-xl">
      <strong>To request tokens using the Mina Testnet Faucet:</strong>
    </p>
    <ul class="mt-4 space-y-1" role="list">
      <li>Select the network you wish to participate in.</li>
      <li>Enter the address you want to fund.</li>
      <li>Click <strong>Request Funds.</strong></li>
      <li>Funds will arrive to your Mina account within the next block.</li>
    </ul>
  </div>
  <Form />
  <p
    class="prose prose-indigo prose-lg text-gray-500 mx-auto text-center mt-12"
  >
    <i
      >Users who request funds with the Mina Testnet Faucet have a limit to <strong
        >one faucet request per account
      </strong>to ensure everyone has access to funds.</i
    >
  </p>
</div>
