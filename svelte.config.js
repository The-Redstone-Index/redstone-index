import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: process.env.NODE_ENV === 'development' ? false : true
		}
	},
	preprocess: [
		vitePreprocess({
			postcss: true
		})
	]
};

export default config;
