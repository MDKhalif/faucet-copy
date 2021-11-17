<script>
  export let copy;
  export let bgColor;

  const bgColorStyles = bgColor ? bgColor : 'bg-orange-mina-primary';

  const borderStyles =
    'border border-black-mina-primary rounded-tl-sm rounded-br-sm';

  const afterStyles = `after:absolute after:border after:border-black-mina-primary after:top-1 after:left:1 after:-bottom-1 after:-right-1 after:w-full after:translate-z-n1 
    after:rounded-tl-sm after:rounded-tr-sm after:rounded-br-md after:rounded-bl-sm 
    transform-style-preserve-3d hover:after:border-0 hover:after:-translate-x-1 hover:after:-translate-y-1
    after:button-border-transition-transform`;

  const baseButtonStyles = `relative w-full uppercase flex items-center justify-center px-5 py-3
    shadow-sm font-medium text-white text-xs tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-mina-primary 
    `;
  const activeStyle = `bg-black-mina-primary text-white`;
  const inactiveStyle = 'bg-white text-black-mina-primary';
</script>

<div class={`flex items-center justify-center w-auto ${afterStyles}`}>
  <div
    class={`${baseButtonStyles} ${activeStyle} border border-r-0 border-black-mina-primary rounded-tl-sm rounded-br-sm bg-black-mina-primary`}
  >
    <span>Devnet</span>
  </div>
  <div
    class={`${baseButtonStyles} ${inactiveStyle} border border-black-mina-primary rounded-tl-sm rounded-br-sm`}
  >
    <span>Snappnet</span>
  </div>
</div>
