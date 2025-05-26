<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import PWAInstaller from '$lib/components/PWAInstaller.svelte';

	injectAnalytics();
</script>

<div class="relative min-h-screen">
	<slot />

<PWAInstaller />
</div>
