<script lang="ts">
	export let options: Array<{
		value: string;
		label: string;
		description?: string;
	}>;
	export let name: string;
	export let selected: string;
	export let className = '';
	export let optionClassName = '';

	function handleChange(value: string) {
		selected = value;
	}
</script>

<div class={`flex gap-4 ${className}`}>
	{#each options as option (option.value)}
		<label class={`flex items-center gap-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-700 transition-colors ${selected === option.value ? 'bg-green-600 text-white radio-label-gleam' : 'bg-slate-600 text-gray-300'} ${optionClassName}`}>
			<input 
				type="radio" 
				bind:group={selected} 
				name={name} 
				value={option.value} 
				class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" 
				on:change={() => handleChange(option.value)}
			/>
			<span class="text-sm">{option.label}</span>
		</label>
	{/each}
</div> 