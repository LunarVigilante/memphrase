import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter({
			// Use Node.js runtime for nodemailer compatibility
			// Using default Node.js 22.x (latest LTS)
		})
	},
	extensions: ['.svelte']
};

export default config;
