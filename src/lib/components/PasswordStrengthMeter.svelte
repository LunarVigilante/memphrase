<script lang="ts">
	import CustomTooltip from './CustomTooltip.svelte';

	export let strength: {
		label: string;
		score: number;
		entropy: number;
		colorClass: string;
	} | null = null;
	export let hasError = false;

	$: strengthPercentage = strength ? ((strength.score || 0) / 4) * 100 : 0;
</script>

{#if strength}
	<div class="w-full">
		<div class="flex justify-center items-baseline text-center">
			<span class="text-sm font-medium text-gray-300 mr-1">Strength:</span>
			<span class={`font-semibold mr-1 ${hasError ? 'text-red-400' : strength.colorClass}`}>
				{strength.label}
			</span>
			{#if !hasError && strength.entropy > 0}
				<CustomTooltip
					text="Entropy (bits): Measures unpredictability. Higher is better."
					position="top"
				>
					<span role="status" class="text-xs text-gray-500 italic">({strength.entropy.toFixed(1)} bits)</span>
				</CustomTooltip>
			{/if}
		</div>
		<div class="mt-1 h-2 w-full rounded-full bg-slate-700 overflow-hidden">
			<div
				class={`strength-bar-fill h-full rounded-full transition-all duration-300 ease-in-out ${hasError ? 'bg-red-500' : (strength.colorClass ? strength.colorClass.replace('text-', 'bg-') : 'bg-gray-500')}`}
				style={`width: ${hasError ? '100%' : strengthPercentage}%`}
			></div>
		</div>
	</div>
{/if} 