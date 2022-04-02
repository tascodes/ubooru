const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		colors: ({ colors }) => ({
			// This is the main color of your UI - it determines some buttons, icons, and lots of other branding.
			primary: colors.sky,

			/**
			 * If you want to define more specific primary colors:
			 *  - Uncomment the below `primary:` block
			 *  - Comment out or delete the above `primary:` line
			 * You can use existing tailwindcss colors (like it is now) or use custom hex colors like '#0D9488'
			 */
			/* primary: {
				50: colors.teal['50'],
				100: colors.teal['100'],
				200: colors.teal['200'],
				300: colors.teal['300'],
				400: colors.teal['400'],
				500: colors.teal['500'],
				600: colors.teal['600'],
				700: colors.teal['700'],
				800: colors.teal['800'],
				900: colors.teal['900']
			}, */

			focus: colors.sky['500'],

			links: colors.blue['500'],

			inherit: colors.inherit,
			current: colors.current,
			transparent: colors.transparent,
			black: colors.black,
			white: colors.white,
			slate: colors.slate,
			gray: colors.gray,
			zinc: colors.zinc,
			neutral: colors.neutral,
			stone: colors.stone,
			red: colors.red,
			orange: colors.orange,
			amber: colors.amber,
			yellow: colors.yellow,
			lime: colors.lime,
			green: colors.green,
			emerald: colors.emerald,
			teal: colors.teal,
			cyan: colors.cyan,
			sky: colors.sky,
			blue: colors.blue,
			indigo: colors.indigo,
			violet: colors.violet,
			purple: colors.purple,
			fuchsia: colors.fuchsia,
			pink: colors.pink,
			rose: colors.rose
		})
	},
	plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')]
};
