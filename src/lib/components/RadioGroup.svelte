<script lang="ts">
	import { onMount } from 'svelte';
	import { KeyboardNavigation } from '$lib/utils/accessibilityUtils';

	export let options: Array<{
		value: string;
		label: string;
		description?: string;
	}>;
	export let name: string;
	export let selected: string;
	export let className = '';
	export let optionClassName = '';
	export let ariaLabel = '';

	let groupElement: HTMLElement;
	let cleanup: (() => void) | null = null;

	function handleChange(value: string) {
		selected = value;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		
		const currentIndex = options.findIndex(opt => opt.value === selected);
		let newIndex;
		
		if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			newIndex = (currentIndex + 1) % options.length;
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			newIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
		} else if (event.key === 'Home') {
			newIndex = 0;
		} else if (event.key === 'End') {
			newIndex = options.length - 1;
		} else {
			return;
		}
		
		selected = options[newIndex].value;
		
		// Focus the new radio button
		const radioButtons = groupElement.querySelectorAll('input[type="radio"]');
		(radioButtons[newIndex] as HTMLElement)?.focus();
	}

	onMount(() => {
		if (groupElement) {
			cleanup = KeyboardNavigation.addKeyboardHandlers(groupElement, {
				onArrowKeys: handleKeydown
			});
		}

		return () => {
			cleanup?.();
		};
	});
</script>

<div bind:this={groupElement} class={`flex gap-4 ${className}`} role="radiogroup" aria-label={ariaLabel || name}>
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