<script lang="ts">
	import CustomTooltip from './CustomTooltip.svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';
	import { onMount } from 'svelte';
	
	export let strength: {
		label: string;
		score: number;
		entropy: number;
		colorClass: string;
		loadingProgress?: { loaded: number; total: number; percentage: number };
	} | null = null;
	export let hasError = false;
	export let showAnimation = true;
	
	let mounted = false;
	let previousScore = 0;
	
	onMount(() => {
		mounted = true;
	});
	
	// Reactive values for smooth animations
	$: strengthPercentage = strength ? ((strength.score || 0) / 4) * 100 : 0;
	$: isLoading = strength?.loadingProgress ? strength.loadingProgress.percentage < 100 : false;
	$: loadingProgress = strength?.loadingProgress?.percentage || 100;
	
	// Animation trigger
	$: if (mounted && strength && strength.score !== previousScore) {
		previousScore = strength.score;
	}
	
	// Color transition classes
	$: strengthBarClass = hasError 
		? 'bg-red-400' 
		: strength 
			? getBarColorClass(strength.score)
			: 'bg-gray-400';
			
	function getBarColorClass(score: number): string {
		switch (score) {
			case 4: return 'bg-green-500';
			case 3: return 'bg-green-400';
			case 2: return 'bg-yellow-500';
			case 1: return 'bg-orange-500';
			default: return 'bg-red-500';
		}
	}
	
	// Pulse animation for loading
	let pulseAnimation = false;
	$: if (isLoading) {
		pulseAnimation = true;
		setTimeout(() => pulseAnimation = false, 300);
	}
</script>

{#if strength}
	<div class="w-full space-y-2">
		<!-- Loading indicator for word list loading -->
		{#if isLoading}
			<div class="flex items-center justify-center gap-2 mb-2">
				<LoadingIndicator 
					size="sm" 
					text="Loading words..." 
					progress={loadingProgress}
					inline={true}
					theme="dark"
				/>
			</div>
		{/if}
		
		<!-- Strength label and entropy -->
		<div class="flex justify-center items-baseline text-center">
			<span class="text-sm font-medium text-gray-300 mr-1">Strength:</span>
			<span 
				class={`font-semibold mr-1 transition-colors duration-500 ${hasError ? 'text-red-400' : strength.colorClass} ${pulseAnimation ? 'animate-pulse' : ''}`}
			>
				{strength.label}
			</span>
			{#if !hasError && strength.entropy > 0}
				<CustomTooltip
					text="Entropy (bits): Measures unpredictability. Higher is better."
					position="top"
				>
					<span class="text-xs text-gray-500 cursor-help">
						({strength.entropy} bits)
					</span>
				</CustomTooltip>
			{/if}
		</div>
		
		<!-- Animated progress bar -->
		<div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
			<div 
				class={`h-full transition-all duration-700 ease-out rounded-full ${strengthBarClass} ${showAnimation ? 'animate-strength-grow' : ''}`}
				style="width: {strengthPercentage}%"
				role="progressbar"
				aria-valuenow={strengthPercentage}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label="Password strength: {strength.label}"
			></div>
		</div>
		
		<!-- Strength indicators (dots) -->
		<div class="flex justify-center gap-1 mt-2">
			{#each Array(4) as _, i}
				<div 
					class={`w-2 h-2 rounded-full transition-all duration-300 ${
						i < strength.score 
							? getBarColorClass(strength.score) + ' scale-110' 
							: 'bg-gray-600 scale-100'
					}`}
					style="transition-delay: {i * 100}ms"
				></div>
			{/each}
		</div>
		
		<!-- Recommendation text with fade-in animation -->
		{#if strength.score > 0}
			<div class="text-center animate-fade-in mt-3">
				<p class="text-xs text-gray-400">
					{#if strength.score >= 4}
						<span class="not-italic">🛡️</span> Excellent! This passphrase is very secure.
					{:else if strength.score >= 3}
						<span class="not-italic">✅</span> Strong passphrase, well protected.
					{:else if strength.score >= 2}
						<span class="not-italic">⚡</span> Good strength, consider adding complexity.
					{:else if strength.score >= 1}
						<span class="not-italic">⚠️</span> Fair, but could be stronger.
					{:else}
						<span class="not-italic">❌</span> Too weak, please generate a new one.
					{/if}
				</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes strength-grow {
		0% {
			width: 0%;
			transform: scaleX(0);
		}
		50% {
			transform: scaleX(1.05);
		}
		100% {
			transform: scaleX(1);
		}
	}
	
	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.animate-strength-grow {
		animation: strength-grow 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: left;
	}
	
	.animate-fade-in {
		animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
	}
	
	.animate-pulse {
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 2;
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style> 