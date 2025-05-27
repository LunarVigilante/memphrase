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
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	build: {
		// Performance optimizations
		rollupOptions: {
			output: {
				manualChunks: {
					// Split vendor libraries into separate chunks
					vendor: ['svelte', '@sveltejs/kit'],
					paraglide: ['$lib/paraglide/runtime', '$lib/paraglide/messages']
				}
			}
		},
		// Enable compression and minification
		minify: 'esbuild',
		cssMinify: true,
		// Optimize chunk size
		chunkSizeWarningLimit: 1000,
		// Enable source maps for production debugging (optional)
		sourcemap: false
	},
	optimizeDeps: {
		// Pre-bundle heavy dependencies
		include: ['svelte', '@sveltejs/kit']
	},
	server: {
		// Development server optimizations
		hmr: {
			overlay: false // Disable error overlay for better performance
		}
	},
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
