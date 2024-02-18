/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			transitionProperty: {
				height: 'height'
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@skeletonlabs/tw-plugin').skeleton({
			themes: {
				// Register each theme within this array:
				preset: ['crimson']
			}
		})
	]
};
