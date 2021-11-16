const config = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/**/*.svelte'],

  theme: {
    extend: {
      height: () => ({
        'screen/2': '50vh',
      }),
      colors: {
        'black-mina-primary': '#2D2D2D',
        'orange-mina-primary': '#FF603B',
        'orange-mina-dark': '#CE613b',
        'orange-mina-medium': '#D15623',
        'orange-mina-light': '#EC9553',
      },
      letterSpacing: {
        wide_medium: '0.03em',
      },
    },
    zIndex: {
      '-1': -1,
    },
  },

  plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
