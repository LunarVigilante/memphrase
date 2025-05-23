<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let text = 'Loading...';
	export let progress: number | null = null; // 0-100 for progress bar
	export let inline = false;
	export let theme: 'dark' | 'light' = 'dark';
	
	// Size mappings
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6', 
		lg: 'w-8 h-8'
	};
	
	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};
	
	$: spinnerSize = sizeClasses[size];
	$: textSize = textSizes[size];
	$: themeClasses = theme === 'dark' 
		? 'text-slate-300 border-slate-600 border-t-green-500' 
		: 'text-gray-600 border-gray-300 border-t-blue-500';
</script>

<div class={`flex items-center gap-3 ${inline ? 'inline-flex' : 'flex'}`}>
	<!-- Spinning indicator -->
	<div 
		class={`${spinnerSize} border-2 border-solid rounded-full animate-spin ${themeClasses}`} 
		role="status"
		aria-label={text}
	></div>
	
	<!-- Loading text -->
	{#if text}
		<span class={`${textSize} ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'} animate-pulse`}>
			{text}
		</span>
	{/if}
	
	<!-- Progress bar (optional) -->
	{#if progress !== null}
		<div class="flex-1 min-w-0">
			<div class={`w-full bg-gray-200 rounded-full h-2 ${theme === 'dark' ? 'dark:bg-gray-700' : ''}`}>
				<div 
					class="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out" 
					style="width: {Math.max(0, Math.min(100, progress))}%"
					role="progressbar"
					aria-valuenow={progress}
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>
			<span class={`${textSizes.sm} ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} mt-1 block`}>
				{Math.round(progress)}%
			</span>
		</div>
	{/if}
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style> 