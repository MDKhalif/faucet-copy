const config = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/**/*.svelte'],

  theme: {
    extend: {
      width: {
        '5/13': '39.5%',
      },
      height: {
        'screen/2': '50vh',
        'screen1.5': '150vh',
      },
      colors: {
        'black-mina-primary': '#2D2D2D',
        'orange-mina-primary': '#FF603B',
        'orange-mina-dark': '#CE613b',
        'orange-mina-medium': '#D15623',
        'orange-mina-light': '#EC9553',
        'gray-mina-primary': '#D9D9D9',
        'focused-mina': '#5362C8',
        'error-mina': '#E93939',
      },
      letterSpacing: {
        wide_medium: '0.03em',
      },
    },
    zIndex: {
      '-1': -1,
    },
    backgroundImage: {
      'dark-button': "url('/static/images/button-hover-dark.png')",
      'light-button': "url('static/images/button-hover-light.png')",
    },
  },

  plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
