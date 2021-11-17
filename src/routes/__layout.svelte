<script>
  import '../app.css';
</script>

<div
  class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 h-screen1.5 sm:h-screen sm:mb-6"
>
  <div class="max-w-6xl mx-auto">
    <slot />
  </div>
</div>

<style>
  @font-face {
    font-family: MonumentGroteskRegular;
    src: url('/fonts/MonumentGrotesk-Regular.woff2') format('woff2'),
      url('/fonts/MonumentGrotesk-Regular.woff') format('woff');
  }
  @font-face {
    font-family: MonumentGroteskMono;
    font-weight: 400;
    src: url(/fonts/MonumentGrotesk-Mono.woff) format('woff');
  }
  * {
    font-family: 'MonumentGroteskRegular', 'MonumentGroteskMono', sans-serif;
  }
</style>
