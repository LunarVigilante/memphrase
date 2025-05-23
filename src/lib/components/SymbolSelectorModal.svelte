<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let availableSymbols: string = ''; // Full string of all possible symbols
	export let selectedSymbols: string[] = []; // Array of currently selected symbols

	const dispatch = createEventDispatcher();

	let internalSelected: string[] = [];

	$: if (isOpen) {
		internalSelected = [...selectedSymbols]; // Reset internal state when modal opens
	}

	function toggleSymbol(symbol: string) {
		if (internalSelected.includes(symbol)) {
			internalSelected = internalSelected.filter(s => s !== symbol);
		} else {
			internalSelected = [...internalSelected, symbol];
		}
	}

	function selectAll() {
		internalSelected = availableSymbols.split('');
	}

	function deselectAll() {
		internalSelected = [];
	}

	function saveSelection() {
		dispatch('save', internalSelected);
		closeModal();
	}

	function closeModal() {
		dispatch('close');
	}

	// Handle Escape key to close modal
	function handleKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') { // Only act if modal is open
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" 
		on:click={closeModal}
		on:keydown={(e) => {if (e.key === 'Enter' || e.key === ' ') closeModal()}}
		aria-label="Close modal backdrop"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full m-4 text-slate-200 border border-slate-700" 
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-labelledby="modal-title"
			aria-modal="true"
			tabindex="0"
		>
			<h2 id="modal-title" class="text-xl font-semibold mb-4 text-slate-100">Select Symbols</h2>
			
			<div class="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-4 max-h-60 overflow-y-auto p-2 bg-slate-700/50 rounded-md border border-slate-600">
				{#each availableSymbols.split('') as symbol (symbol)}
					<label 
						class="flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors duration-150 aspect-square
						{internalSelected.includes(symbol) ? 'bg-green-500 text-white' : 'bg-slate-600 hover:bg-slate-500'}"
						title={symbol}
					>
						<input 
							type="checkbox" 
							checked={internalSelected.includes(symbol)} 
							on:change={() => toggleSymbol(symbol)}
							class="opacity-0 w-0 h-0 absolute" 
						/>
						<span class="font-mono text-lg select-none">{symbol}</span>
					</label>
				{/each}
			</div>

			<div class="flex justify-between items-center mb-6 space-x-2">
				<button on:click={selectAll} class="text-xs px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">Select All</button>
				<button on:click={deselectAll} class="text-xs px-3 py-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white transition-colors">Deselect All</button>
				<span class="text-xs text-slate-400">{internalSelected.length} / {availableSymbols.length} selected</span>
			</div>

			<div class="flex justify-end space-x-3">
				<button on:click={closeModal} class="px-4 py-2 rounded-md text-sm font-medium bg-slate-600 hover:bg-slate-500 text-slate-200 transition-colors">
					Cancel
				</button>
				<button on:click={saveSelection} class="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors button-gleam" disabled={internalSelected.length === 0}>
					Apply Selection
				</button>
			</div>
		</div>
	</div>
{/if} 