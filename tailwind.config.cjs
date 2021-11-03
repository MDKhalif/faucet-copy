const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			height: (theme) => ({
				'screen/2': '50vh'
			})
		}
	},

	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
