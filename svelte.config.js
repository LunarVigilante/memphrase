import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			// See https://kit.svelte.dev/docs/adapter-vercel for more information
			// and https://vercel.com/docs/projects/project-configuration#project-settings/framework-detection
			// for Vercel-specific options if needed.
			runtime: 'nodejs18.x' // Or your desired Node.js runtime for Vercel serverless functions
		})
	},
	extensions: ['.svelte', '.svx']
};

export default config;
