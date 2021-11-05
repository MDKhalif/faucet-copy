<script>
  export let menuOpen;
  export let items;
  export let currentItem;

  /**
   * This action is fired when the Dropdown component is mounted. The action initially sets up a
   * click event listener on the window object with the initial state. If a click event is fired
   * and the target is not the Dropdown component, the action calls a user specified callback function.
   *
   * In this case, the callback function sets the `menuOpen` state to false. If the component is unmounted,
   * the action does the necessary clean up and removes the click event listener.
   */
  function clickOutside(node, { enabled: initialEnabled, cb }) {
    const handleOutsideClick = ({ target }) => {
      if (!node.contains(target)) {
        cb();
      }
    };

    function update({ enabled }) {
      if (enabled) {
        window.addEventListener('click', handleOutsideClick);
      } else {
        window.removeEventListener('click', handleOutsideClick);
      }
    }
    update({ enabled: initialEnabled });
    return {
      update,
      destroy() {
        window.removeEventListener('click', handleOutsideClick);
      },
    };
  }
</script>

<div
  class="relative inline-block text-left"
  use:clickOutside={{ enabled: menuOpen, cb: () => (menuOpen = false) }}
  on:click={() => (menuOpen = !menuOpen)}
>
  <div>
    <button
      type="button"
      class="inline-flex justify-between w-full sm:w-52 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black-mina-primary"
      id="menu-button"
      aria-expanded="true"
      aria-haspopup="true"
    >
      {currentItem}
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <div
    class="origin-top-right absolute right-0 w-full sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer"
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="menu-button"
    tabindex="-1"
  >
    <div crole="none" class="w-full">
      {#if menuOpen}
        {#each items as item}
          <p
            class="text-gray-700 hover:bg-gray-200 w-full block px-4 py-2 text-sm"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            on:click={(e) => {
              currentItem = e.target.innerText;
            }}
          >
            {item}
          </p>
        {/each}
      {/if}
    </div>
  </div>
</div>
