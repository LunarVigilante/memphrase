<script lang="ts">
	import { createIntersectionObserver } from '$lib/utils/performanceOptimizations';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let threshold = 0.1;
	export let rootMargin = '50px';
	export let once = true;
	export let placeholder = '';
	export let className = '';

	let visible = false;
	let element: HTMLElement;
	let observer: IntersectionObserver | null = null;

	onMount(() => {
		observer = createIntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visible = true;
						if (once && observer) {
							observer.unobserve(element);
						}
					} else if (!once) {
						visible = false;
					}
				});
			},
			{
				threshold,
				rootMargin
			}
		);

		if (observer && element) {
			observer.observe(element);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<div bind:this={element} class={className}>
	{#if visible}
		<div transition:fade={{ duration: 200 }}>
			<slot />
		</div>
	{:else if placeholder}
		<div class="flex items-center justify-center p-4 text-gray-400">
			{placeholder}
		</div>
	{/if}
</div> 