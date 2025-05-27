<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import {
		generatePassphraseService,
		type PassphraseOptions,
		calculatePassphraseStrength,
		type PassphraseStrengthResult
	} from '$lib/passwordUtils';
	import { categories as wordListCategories, defaultCategories as defaultLeafCategories } from '$lib/words';

	interface BulkResult {
		passphrase: string;
		strength: PassphraseStrengthResult;
		index: number;
	}

	// Configuration
	let quantity = 20;
	let numWords = 4;
	let separator = '-';
	let capitalize = true;
	let numDigits = 1;
	let numSymbols = 1;
	let selectedCategories: string[] = [...defaultLeafCategories];

	// Generation state
	let results: BulkResult[] = [];
	let isGenerating = false;
	let progress = 0;

	// Export format
	let exportFormat: 'txt' | 'csv' | 'json' = 'txt';

	const minQuantity = 10;
	const maxQuantity = 100;

	// Generate bulk passphrases
	async function generateBulk() {
		if (isGenerating || selectedCategories.length === 0) return;

		isGenerating = true;
		progress = 0;
		results = [];

		try {
			const options: PassphraseOptions = {
				generationMode: 'words' as const,
				numWords,
				separator,
				capitalize,
				numDigits,
				numSymbols,
				selectedCategories,
				numSymPosition: 'append' as const,
				charGrouping: 'together' as const
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

	// Calculate average strength
	$: averageStrength = results.length > 0 ? {
		score: results.reduce((sum, r) => sum + r.strength.score, 0) / results.length,
		entropy: results.reduce((sum, r) => sum + r.strength.entropy, 0) / results.length
	} : null;

	$: quantityValid = quantity >= minQuantity && quantity <= maxQuantity;
	$: canGenerate = quantityValid && selectedCategories.length > 0;
</script>

<svelte:head>
	<title>Bulk Passphrase Generator - MemPhrase</title>
	<meta name="description" content="Generate multiple secure passphrases at once. Create 10-100 passphrases in bulk with customizable options." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Bulk Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-3xl">
		Generate multiple secure passphrases at once. Perfect for creating unique passwords for 
		multiple accounts, team setups, or batch provisioning scenarios.
	</p>

	<!-- Configuration -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Configuration</h2>
		
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
			</div>

			<!-- Word Categories -->
			<div class="space-y-4">
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
					Generate {quantity} Passphrases
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
						<h3 class="text-lg font-semibold text-gray-100">Generated {results.length} Passphrases</h3>
						{#if averageStrength}
							<p class="text-sm text-gray-400">
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
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Generated Passphrases</h3>
				
				<div class="max-h-96 overflow-y-auto space-y-2">
					{#each results as result (result.index)}
						<div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-md border border-slate-600">
							<div class="flex items-center gap-3 flex-1 min-w-0">
								<span class="text-xs text-gray-400 w-8 flex-shrink-0">#{result.index}</span>
								<button
									on:click={() => copySingle(result.passphrase)}
									class="font-mono text-sm bg-slate-900 px-3 py-1 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 text-left break-all flex-1 min-w-0"
									title="Click to copy"
								>
									{result.passphrase}
								</button>
								<div class="flex items-center gap-2 flex-shrink-0">
									<span class="text-xs px-2 py-1 rounded-full bg-slate-600 text-gray-300">
										{result.strength.entropy.toFixed(1)} bits
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Use Cases -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Common Use Cases</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Personal Use</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Create unique passwords for multiple online accounts</li>
					<li>• Generate backup passphrases for password managers</li>
					<li>• Prepare secure credentials for family members</li>
					<li>• Create passphrases for different devices and services</li>
				</ul>
			</div>

			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Business & Teams</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Batch create credentials for team onboarding</li>
					<li>• Generate temporary passwords for events or sessions</li>
					<li>• Create secure passphrases for shared accounts</li>
					<li>• Prepare credentials for system provisioning</li>
				</ul>
			</div>
		</div>

		<div class="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/50">
			<h4 class="text-md font-medium text-blue-400 mb-2">🔒 Security Best Practices</h4>
			<ul class="text-sm text-blue-300 space-y-1">
				<li>• Use each generated passphrase for only one account or service</li>
				<li>• Store passphrases securely in a password manager</li>
				<li>• Don't share bulk-generated files over insecure channels</li>
				<li>• Delete exported files after importing to your password manager</li>
				<li>• Consider using higher word counts for critical accounts</li>
			</ul>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			All passphrase generation is performed entirely in your browser. No data is transmitted to servers.
		</p>
	</div>

	<Footer />
</main> 