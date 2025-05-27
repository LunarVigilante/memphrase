<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import SymbolSelectorModal from '$lib/components/SymbolSelectorModal.svelte';
	import {
		generatePassphraseService,
		type PassphraseOptions,
		calculatePassphraseStrength,
		type PassphraseStrengthResult,
		DEFAULT_PASSPHRASE_SYMBOLS,
		ALL_AVAILABLE_SYMBOLS
	} from '$lib/passwordUtils';
	import { categories as wordListCategories, defaultCategories as defaultLeafCategories } from '$lib/words';

	interface BulkResult {
		passphrase: string;
		strength: PassphraseStrengthResult;
		index: number;
	}

	// Configuration
	let quantity = 20;
	
	// Generation mode
	let generationMode: 'words' | 'randomChars' = 'words';
	
	// Word-based options
	let numWords = 4;
	let separator = '-';
	let capitalize = true;
	let numDigits = 1;
	let numSymbols = 1;
	let selectedCategories: string[] = [...defaultLeafCategories];
	let numSymPosition: 'append' | 'prepend' | 'interspersed' = 'append';
	let charGrouping: 'together' | 'separate' = 'together';
	let customSymbolsWordMode: string[] = DEFAULT_PASSPHRASE_SYMBOLS.split('');
	
	// Random character options
	let randomPasswordLength = 16;
	let randomIncludeLowercase = true;
	let randomIncludeUppercase = true;
	let randomIncludeNumbers = true;
	let randomIncludeSymbols = true;
	let customSymbolsRandomMode: string[] = DEFAULT_PASSPHRASE_SYMBOLS.split('');

	// UI state
	let showSymbolModal = false;
	let editingSymbolSetFor: 'words' | 'randomChars' = 'words';
	let wordCategoriesOpen = false;
	let numbersSymbolsOpen = false;
	let randomOptionsOpen = false;

	// Generation state
	let results: BulkResult[] = [];
	let isGenerating = false;
	let progress = 0;

	// Export format
	let exportFormat: 'txt' | 'csv' | 'json' = 'txt';

	const minQuantity = 10;
	const maxQuantity = 100;

	// Reactive computations
	$: numDigitsForWordMode = Math.max(0, Math.min(5, Number(numDigits) || 0));
	$: numSymbolsForWordMode = Math.max(0, Math.min(5, Number(numSymbols) || 0));
	$: randomPasswordLength = Math.max(8, Math.min(128, Number(randomPasswordLength) || 8));
	$: quantityValid = quantity >= minQuantity && quantity <= maxQuantity;
	$: canGenerate = quantityValid && (generationMode === 'randomChars' || selectedCategories.length > 0);

	// Generate bulk passphrases
	async function generateBulk() {
		if (isGenerating || !canGenerate) return;

		isGenerating = true;
		progress = 0;
		results = [];

		try {
			const options: PassphraseOptions = {
				generationMode,
				// Word-based options
				numWords,
				separator,
				capitalize,
				numDigits: generationMode === 'words' ? numDigitsForWordMode : 0,
				numSymbols: generationMode === 'words' ? numSymbolsForWordMode : 0,
				selectedCategories: generationMode === 'words' ? selectedCategories : [],
				numSymPosition,
				charGrouping,
				// Random char options
				randomPasswordLength: generationMode === 'randomChars' ? randomPasswordLength : undefined,
				randomIncludeLowercase: generationMode === 'randomChars' ? randomIncludeLowercase : undefined,
				randomIncludeUppercase: generationMode === 'randomChars' ? randomIncludeUppercase : undefined,
				randomIncludeNumbers: generationMode === 'randomChars' ? randomIncludeNumbers : undefined,
				randomIncludeSymbols: generationMode === 'randomChars' ? randomIncludeSymbols : undefined,
				customSymbols: generationMode === 'words' ? customSymbolsWordMode : customSymbolsRandomMode
			};

			for (let i = 0; i < quantity; i++) {
				const passphrase = generatePassphraseService(options);
				const strength = calculatePassphraseStrength(passphrase, options);
				
				results.push({
					passphrase,
					strength,
					index: i + 1
				});

				progress = ((i + 1) / quantity) * 100;
				
				// Update UI periodically
				if (i % 5 === 0) {
					results = [...results];
					await new Promise(resolve => setTimeout(resolve, 1));
				}
			}

			results = [...results]; // Final update
		} catch (error) {
			console.error('Error generating passphrases:', error);
			alert('Failed to generate passphrases. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Copy all passphrases
	async function copyAll() {
		if (!navigator.clipboard || results.length === 0) return;
		
		try {
			const text = results.map(r => r.passphrase).join('\n');
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Copy single passphrase
	async function copySingle(passphrase: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(passphrase);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Export functions
	function exportData() {
		if (results.length === 0) return;

		const timestamp = new Date().toISOString().split('T')[0];
		let content = '';
		let filename = '';

		switch (exportFormat) {
			case 'txt':
				content = results.map((r, i) => `${i + 1}. ${r.passphrase}`).join('\n');
				filename = `passphrases-${timestamp}.txt`;
				break;
			case 'csv':
				content = 'Index,Passphrase,Strength,Entropy\n' + 
					results.map(r => `${r.index},"${r.passphrase}","${r.strength.label}",${r.strength.entropy.toFixed(1)}`).join('\n');
				filename = `passphrases-${timestamp}.csv`;
				break;
			case 'json':
				content = JSON.stringify({
					generated: new Date().toISOString(),
					count: results.length,
					passphrases: results.map(r => ({
						index: r.index,
						passphrase: r.passphrase,
						strength: r.strength.label,
						entropy: r.strength.entropy
					}))
				}, null, 2);
				filename = `passphrases-${timestamp}.json`;
				break;
		}

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Symbol modal functions
	function openSymbolModal(mode: 'words' | 'randomChars') {
		editingSymbolSetFor = mode;
		showSymbolModal = true;
	}

	function handleSymbolUpdate(event: CustomEvent<string[]>) {
		if (editingSymbolSetFor === 'words') {
			customSymbolsWordMode = event.detail;
		} else {
			customSymbolsRandomMode = event.detail;
		}
		showSymbolModal = false;
	}

	// Calculate average strength
	$: averageStrength = results.length > 0 ? {
		score: results.reduce((sum, r) => sum + r.strength.score, 0) / results.length,
		entropy: results.reduce((sum, r) => sum + r.strength.entropy, 0) / results.length
	} : null;
</script>

<svelte:head>
	<title>Bulk Passphrase Generator - MemPhrase</title>
	<meta name="description" content="Generate multiple secure passphrases at once. Create 10-100 passphrases in bulk with full customization options." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Bulk Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-3xl">
		Generate multiple secure passphrases at once with full customization. Choose between memorable word-based 
		passphrases or strong random character passwords. Perfect for creating unique passwords for multiple accounts.
	</p>

	<!-- Configuration -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Configuration</h2>
		
		<!-- Generation Mode Selection -->
		<div class="mb-6">
			<h3 class="text-lg font-medium text-green-400 mb-4">Generation Method</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<label 
					class="flex items-center gap-3 cursor-pointer p-4 border rounded-lg hover:border-slate-500 transition-colors {generationMode === 'words' ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-slate-600'}"
				>
					<input type="radio" bind:group={generationMode} value="words" class="text-green-500 focus:ring-green-500" />
					<div>
						<div class="text-sm font-medium text-gray-200">Word-based (Memorable)</div>
						<div class="text-xs text-gray-400">Easy to remember passphrases using real words</div>
					</div>
				</label>
				<label 
					class="flex items-center gap-3 cursor-pointer p-4 border rounded-lg hover:border-slate-500 transition-colors {generationMode === 'randomChars' ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-slate-600'}"
				>
					<input type="radio" bind:group={generationMode} value="randomChars" class="text-green-500 focus:ring-green-500" />
					<div>
						<div class="text-sm font-medium text-gray-200">Random Characters (Strong)</div>
						<div class="text-xs text-gray-400">Maximum security with random character combinations</div>
					</div>
				</label>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Basic Settings -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-green-400 mb-4">Generation Settings</h3>
				
				<div>
					<CustomTooltip text="Number of passphrases to generate (10-100)" position="top">
						<label for="quantity" class="block text-sm font-medium text-gray-300 mb-2">
							Quantity ({minQuantity}-{maxQuantity})
						</label>
					</CustomTooltip>
					<input 
						type="number" 
						id="quantity"
						bind:value={quantity}
						min={minQuantity}
						max={maxQuantity}
						class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
					/>
					{#if !quantityValid}
						<p class="text-red-400 text-xs mt-1">Quantity must be between {minQuantity} and {maxQuantity}</p>
					{/if}
				</div>

				{#if generationMode === 'words'}
					<!-- Word-based Options -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<CustomTooltip text="Number of words per passphrase" position="top">
								<label for="numWords" class="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
							</CustomTooltip>
							<select 
								id="numWords"
								bind:value={numWords}
								class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value={3}>3 words</option>
								<option value={4}>4 words</option>
								<option value={5}>5 words</option>
								<option value={6}>6 words</option>
							</select>
						</div>
						<div>
							<CustomTooltip text="Character used to separate words" position="top">
								<label for="separator" class="block text-sm font-medium text-gray-300 mb-2">Separator</label>
							</CustomTooltip>
							<select 
								id="separator"
								bind:value={separator}
								class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value="-">Hyphen (-)</option>
								<option value="_">Underscore (_)</option>
								<option value=".">Period (.)</option>
								<option value=" ">Space ( )</option>
								<option value="">No separator</option>
							</select>
						</div>
					</div>

					<label class="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" bind:checked={capitalize} class="rounded text-green-500 focus:ring-green-500" />
						<div>
							<span class="text-sm text-gray-200">Capitalize Words</span>
							<div class="text-xs text-gray-400">First letter of each word uppercase</div>
						</div>
					</label>
				{:else}
					<!-- Random Character Options -->
					<div>
						<CustomTooltip text="Length of generated passwords (8-128)" position="top">
							<label for="randomLength" class="block text-sm font-medium text-gray-300 mb-2">
								Password Length: {randomPasswordLength}
							</label>
						</CustomTooltip>
						<input 
							type="range" 
							id="randomLength"
							bind:value={randomPasswordLength}
							min="8"
							max="128"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={randomIncludeLowercase} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-200">Lowercase (a-z)</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={randomIncludeUppercase} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-200">Uppercase (A-Z)</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={randomIncludeNumbers} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-200">Numbers (0-9)</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={randomIncludeSymbols} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-200">Symbols</span>
						</label>
					</div>

					{#if randomIncludeSymbols}
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-300">Custom Symbols:</span>
							<button
								on:click={() => openSymbolModal('randomChars')}
								class="px-3 py-1 text-xs border border-slate-500 bg-slate-700 text-gray-200 rounded hover:bg-slate-600 transition"
								aria-label="Customize symbols for random character mode"
							>
								⚙️ Customize ({customSymbolsRandomMode.length})
							</button>
							<span class="text-xs text-gray-400">{customSymbolsRandomMode.join('')}</span>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Mode-specific Options -->
			<div class="space-y-4">
				{#if generationMode === 'words'}
					<!-- Word Categories -->
					<div>
						<h3 class="text-lg font-medium text-green-400 mb-4">Word Categories</h3>
						
						<div class="max-h-48 overflow-y-auto border border-slate-600 rounded p-3 bg-slate-700/30">
							{#each wordListCategories as parentCategory}
								{#if parentCategory.subCategories}
									<div class="mb-3">
										<h4 class="text-sm font-medium text-gray-300 mb-2">{parentCategory.name}</h4>
										<div class="grid grid-cols-2 gap-2 ml-2">
											{#each parentCategory.subCategories as subCategory}
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input 
														type="checkbox" 
														bind:group={selectedCategories} 
														value={subCategory.name}
														class="rounded text-green-500 focus:ring-green-500" 
													/>
													<span class="text-gray-200">{subCategory.name}</span>
												</label>
											{/each}
										</div>
									</div>
								{/if}
							{/each}
						</div>

						{#if selectedCategories.length === 0}
							<p class="text-red-400 text-xs">Please select at least one word category</p>
						{/if}
					</div>

					<!-- Numbers & Symbols (Collapsible) -->
					<div class="border border-slate-600 rounded-lg">
						<button
							on:click={() => numbersSymbolsOpen = !numbersSymbolsOpen}
							class="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/30 transition-colors"
							aria-label="Toggle numbers and symbols options"
						>
							<span class="text-md font-medium text-green-400">Numbers & Symbols</span>
							<svg class="w-4 h-4 text-gray-400 transform transition-transform" class:rotate-180={numbersSymbolsOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if numbersSymbolsOpen}
							<div class="p-3 border-t border-slate-600 space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<div>
										<CustomTooltip text="Number of digits to add" position="top">
											<label for="numDigits" class="block text-sm font-medium text-gray-300 mb-2">Numbers</label>
										</CustomTooltip>
										<select 
											id="numDigits"
											bind:value={numDigits}
											class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
										>
											<option value={0}>None</option>
											<option value={1}>1 number</option>
											<option value={2}>2 numbers</option>
											<option value={3}>3 numbers</option>
											<option value={4}>4 numbers</option>
											<option value={5}>5 numbers</option>
										</select>
									</div>
									<div>
										<CustomTooltip text="Number of symbols to add" position="top">
											<label for="numSymbols" class="block text-sm font-medium text-gray-300 mb-2">Symbols</label>
										</CustomTooltip>
										<select 
											id="numSymbols"
											bind:value={numSymbols}
											class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
										>
											<option value={0}>None</option>
											<option value={1}>1 symbol</option>
											<option value={2}>2 symbols</option>
											<option value={3}>3 symbols</option>
											<option value={4}>4 symbols</option>
											<option value={5}>5 symbols</option>
										</select>
									</div>
								</div>

								{#if numSymbols > 0}
									<div class="flex items-center gap-2">
										<span class="text-sm text-gray-300">Custom Symbols:</span>
										<button
											on:click={() => openSymbolModal('words')}
											class="px-3 py-1 text-xs border border-slate-500 bg-slate-700 text-gray-200 rounded hover:bg-slate-600 transition"
											aria-label="Customize symbols for word mode"
										>
											⚙️ Customize ({customSymbolsWordMode.length})
										</button>
										<span class="text-xs text-gray-400">{customSymbolsWordMode.join('')}</span>
									</div>
								{/if}

								{#if numDigits > 0 || numSymbols > 0}
									<div class="space-y-3">
										<div>
											<span class="text-sm font-medium text-gray-300 mb-2 block">Position</span>
											<div class="grid grid-cols-3 gap-2">
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input type="radio" bind:group={numSymPosition} value="prepend" class="text-green-500 focus:ring-green-500" />
													<span class="text-gray-200">Before words</span>
												</label>
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input type="radio" bind:group={numSymPosition} value="append" class="text-green-500 focus:ring-green-500" />
													<span class="text-gray-200">After words</span>
												</label>
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input type="radio" bind:group={numSymPosition} value="interspersed" class="text-green-500 focus:ring-green-500" />
													<span class="text-gray-200">Mixed in</span>
												</label>
											</div>
										</div>

										<div>
											<span class="text-sm font-medium text-gray-300 mb-2 block">Grouping</span>
											<div class="grid grid-cols-2 gap-2">
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input type="radio" bind:group={charGrouping} value="together" class="text-green-500 focus:ring-green-500" />
													<span class="text-gray-200">Together (12#)</span>
												</label>
												<label class="flex items-center gap-2 cursor-pointer text-xs">
													<input type="radio" bind:group={charGrouping} value="separate" class="text-green-500 focus:ring-green-500" />
													<span class="text-gray-200">Separate (1#2)</span>
												</label>
											</div>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateBulk}
				disabled={isGenerating || !canGenerate}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating... ({Math.round(progress)}%)
					</div>
				{:else}
					Generate {quantity} {generationMode === 'words' ? 'Passphrases' : 'Passwords'}
				{/if}
			</button>
		</div>
	</section>

	<!-- Results -->
	{#if results.length > 0}
		<section class="w-full space-y-6">
			<!-- Summary -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
					<div>
						<h3 class="text-lg font-semibold text-gray-100">Generated {results.length} {generationMode === 'words' ? 'Passphrases' : 'Passwords'}</h3>
						{#if averageStrength}
							<p class="text-sm text-gray-400">
								Average Strength: <span class="{averageStrength.score >= 80 ? 'text-green-400' : averageStrength.score >= 60 ? 'text-yellow-400' : 'text-red-400'}">{averageStrength.score.toFixed(0)}%</span> •
								Average Entropy: <span class="text-green-400">{averageStrength.entropy.toFixed(1)} bits</span>
							</p>
						{/if}
					</div>

					<div class="flex flex-wrap gap-3">
						<button
							on:click={copyAll}
							class="button-gleam rounded-md px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700"
						>
							Copy All
						</button>
						
						<button
							on:click={exportData}
							class="rounded-md border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-slate-600 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
						>
							Export as {exportFormat.toUpperCase()}
						</button>
					</div>
				</div>

				<!-- Export Options -->
				<div class="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
					<label for="exportFormat" class="text-sm text-gray-300">Export Format:</label>
					<select 
						id="exportFormat"
						bind:value={exportFormat}
						class="rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
					>
						<option value="txt">Text (.txt)</option>
						<option value="csv">CSV (.csv)</option>
						<option value="json">JSON (.json)</option>
					</select>
				</div>
			</div>

			<!-- Passphrases List -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Generated {generationMode === 'words' ? 'Passphrases' : 'Passwords'}</h3>
				
				<div class="max-h-96 overflow-y-auto space-y-2">
					{#each results as result (result.index)}
						<div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-md border border-slate-600">
							<div class="flex items-center gap-3 flex-1 min-w-0">
								<span class="text-xs text-gray-400 w-8 flex-shrink-0">#{result.index}</span>
								<button
									on:click={() => copySingle(result.passphrase)}
									class="font-mono text-sm bg-slate-900 px-3 py-1 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 text-left break-all flex-1 min-w-0"
									title="Click to copy"
									aria-label="Copy password {result.index}"
								>
									{result.passphrase}
								</button>
								<div class="text-xs text-center flex-shrink-0 w-16">
									<div class="{result.strength.colorClass} font-medium">{result.strength.score}%</div>
									<div class="text-gray-400">{result.strength.entropy.toFixed(0)}b</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Info Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Bulk Generation Benefits</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">⚡ Efficiency</h4>
				<p class="text-sm text-gray-300">
					Generate dozens of unique passwords in seconds. Perfect for setting up 
					multiple accounts or team onboarding scenarios.
				</p>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">🎯 Consistency</h4>
				<p class="text-sm text-gray-300">
					All passwords follow the same security configuration, ensuring 
					consistent strength and compliance across your organization.
				</p>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">📊 Export Options</h4>
				<p class="text-sm text-gray-300">
					Export in multiple formats (TXT, CSV, JSON) for easy integration 
					with password managers or deployment scripts.
				</p>
			</div>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			All passwords are generated locally in your browser. No data is transmitted to servers.
		</p>
	</div>

	<Footer />
</main>

<!-- Symbol Selector Modal -->
{#if showSymbolModal}
	<SymbolSelectorModal
		bind:isOpen={showSymbolModal}
		availableSymbols={ALL_AVAILABLE_SYMBOLS}
		selectedSymbols={editingSymbolSetFor === 'words' ? customSymbolsWordMode : customSymbolsRandomMode}
		on:save={handleSymbolUpdate}
		on:close={() => showSymbolModal = false}
	/>
{/if} 