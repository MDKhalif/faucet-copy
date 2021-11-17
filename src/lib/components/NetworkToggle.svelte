<script>
  export let items;
  export let currentItem;

  const afterStyles = `after:absolute after:border after:border-black-mina-primary after:top-1 after:left:1 after:-bottom-1 after:-right-1 after:w-full
    after:rounded-tl-sm after:rounded-tr-sm after:rounded-br-md after:rounded-bl-sm
    after:translate-z-n1 transform-style-preserve-3d hover:after:border-0 hover:after:-translate-x-1 hover:after:-translate-y-1
    after:button-border-transition-transform`;

  const baseButtonStyles = `relative w-full flex items-center justify-center px-5 py-3
    shadow-sm font-medium text-xs tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-mina-primary
    `;
  const activeStyle = `bg-black-mina-primary text-white`;
  const inactiveStyle = 'bg-white text-black-mina-primary';
</script>

<div
  class={`flex items-center justify-center w-auto uppercase cursor-pointer ${afterStyles}`}
>
  {#each items as item}
    <div
      class={`${baseButtonStyles}
      ${item === currentItem ? activeStyle : inactiveStyle}
      border border-black-mina-primary rounded-tl-sm rounded-br-sm`}
      on:click={() => (currentItem = item)}
    >
      <span class="whitespace-nowrap text-center">{item}</span>
    </div>
  {/each}
</div>
