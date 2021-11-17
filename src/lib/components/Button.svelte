<script>
  import ArrowRightSmall from '/static/images/arrow-right-small.svg';

  export let status;
  export let type;
  export let copy;
  export let bgColor;
  export let onClick;

  const bgColorStyles = bgColor ? bgColor : 'bg-orange-mina-primary';

  const borderStyles =
    'border border-black-mina-primary rounded-tl-sm rounded-br-sm';

  const hoverStyles = 'hover:bg-orange-mina-dark';

  const afterStyles = `after:absolute after:border after:border-black-mina-primary after:top-1 after:left:1 after:-bottom-1 after:-right-1 after:w-full after:translate-z-n1
    after:rounded-tl-sm after:rounded-tr-sm after:rounded-br-md after:rounded-bl-sm
    transform-style-preserve-3d hover:after:border-0 hover:after:-translate-x-1 hover:after:-translate-y-1
    after:button-border-transition-transform`;

  const baseButtonStyles = `relative w-40 sm:w-auto uppercase flex items-center justify-around px-5 py-3
    shadow-sm font-medium text-white text-xs tracking-widest focus:outline-none
		${bgColorStyles} ${borderStyles} ${hoverStyles} ${afterStyles}
    `;
</script>

<button
  on:click={onClick ? onClick : () => {}}
  type={type ? type : ''}
  class={status === 'loading'
    ? `opacity-25 ${baseButtonStyles} after:border-0`
    : baseButtonStyles}
>
  <span class="whitespace-nowrap text-center">{copy}</span>
  <img src={ArrowRightSmall} class="ml-1" alt="Small Right Arrow" />
</button>
