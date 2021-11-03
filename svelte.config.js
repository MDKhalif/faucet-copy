import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
import { searchForWorkspaceRoot } from 'vite';
import { join } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: vercel(),
    vite: {
      server: {
        fs: {
          allow: [searchForWorkspaceRoot(join(process.cwd(), 'settings.js'))],
        },
      },
    },
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
