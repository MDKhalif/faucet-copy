<script>
  import { fade } from 'svelte/transition';
  export let message;
  export let paymentID;
</script>

<div
  in:fade={{ delay: 250 }}
  class="bg-green-50 p-4 w-full max-w-2xl break-all"
>
  <div class="flex">
    <div class="flex-shrink-0">
      <svg
        class="h-5 w-5 text-green-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="ml-3 text-sm font-medium text-green-800">
      <p>{message}</p>
      <span>View your transaction on </span>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`https://devnet.minaexplorer.com/transaction/${paymentID}`}
        class="underline"
        >{`https://devnet.minaexplorer.com/transaction/${paymentID}`}</a
      >
    </div>
  </div>
</div>
