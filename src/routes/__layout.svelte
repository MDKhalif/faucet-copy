<script>
  import '../app.css';
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-64 sm:mb-6">
  <div class="max-w-7xl mx-auto">
    <slot />
  </div>
</div>

<style>
  @font-face {
    font-family: MonumentGroteskRegular;
    src: url(/fonts/MonumentGrotesk-Regular.woff) format('woff');
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
