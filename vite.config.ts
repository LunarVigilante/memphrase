import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Import Tailwind plugins if needed here
// forms from '@tailwindcss/forms';
// typography from '@tailwindcss/typography';

export default defineConfig({
	plugins: [
		tailwindcss({
			// Config object for Tailwind directly inside the Vite plugin
			config: {
				content: ['./src/**/*.{html,js,svelte,ts}'],
				safelist: [
					'bg-red-500',
					'bg-orange-500',
					'bg-yellow-500',
					'bg-green-500',
					'bg-emerald-500',
				],
				darkMode: 'class', // Ensure class strategy is used
				theme: {
					extend: {},
				},
				plugins: [
					// Temporarily remove plugins
					// forms,
					// typography
				]
			}
		}),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
