<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import PWAInstaller from '$lib/components/PWAInstaller.svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	injectAnalytics();
</script>

<div class="relative min-h-screen">
	<Navigation />
	<slot />
	<PWAInstaller />
</div>
