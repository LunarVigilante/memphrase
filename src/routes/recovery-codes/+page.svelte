<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { generatePassphraseService, type PassphraseOptions } from '$lib/passwordUtils';
	import { defaultCategories as defaultLeafCategories } from '$lib/words';

	interface RecoveryCode {
		code: string;
		used: boolean;
	}

	let numberOfCodes = 8;
	let codeLength = 8;
	let includeHyphens = true;
	let generatedCodes: RecoveryCode[] = [];
	let copyButtonText = 'Copy All Codes';
	let isGenerating = false;

	// Character sets for recovery codes
	const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const DIGITS_ONLY = '0123456789';
	const LETTERS_ONLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let codeFormat: 'alphanumeric' | 'digits' | 'letters' | 'words' = 'alphanumeric';
	let wordSeparator = '-';
	let wordsPerCode = 3;

	function getCharacterSet(): string {
		switch (codeFormat) {
			case 'digits': return DIGITS_ONLY;
			case 'letters': return LETTERS_ONLY;
			default: return ALPHANUMERIC;
		}
	}

	function generateSecureRecoveryCode(length: number, charset: string): string {
		if (!browser || !window.crypto) {
			throw new Error('Secure random number generator not available');
		}

		const randomValues = new Uint8Array(length);
		window.crypto.getRandomValues(randomValues);

		let result = '';
		for (let i = 0; i < length; i++) {
			result += charset[randomValues[i] % charset.length];
		}

		// Add hyphens for readability if enabled
		if (includeHyphens && length >= 6) {
			return result.match(/.{1,4}/g)?.join('-') || result;
		}

		return result;
	}

	function generateWordBasedRecoveryCode(): string {
		try {
			const options: PassphraseOptions = {
				generationMode: 'words',
				numWords: wordsPerCode,
				separator: wordSeparator,
				capitalize: true,
				numDigits: 0,
				numSymbols: 0,
				selectedCategories: ['Animals', 'Adjectives', 'Nouns'], // Use simple, memorable categories
				numSymPosition: 'append',
				charGrouping: 'together'
			};

			return generatePassphraseService(options);
		} catch (error) {
			console.error('Error generating word-based code:', error);
			// Fallback to simple word generation
			const simpleWords = ['cat', 'dog', 'red', 'blue', 'run', 'jump', 'happy', 'sad', 'big', 'small'];
			const words: string[] = [];
			for (let i = 0; i < wordsPerCode; i++) {
				words.push(simpleWords[Math.floor(Math.random() * simpleWords.length)]);
			}
			return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(wordSeparator);
		}
	}

	async function generateRecoveryCodes() {
		isGenerating = true;
		copyButtonText = 'Copy All Codes';

		try {
			const codes: RecoveryCode[] = [];

			for (let i = 0; i < numberOfCodes; i++) {
				let code: string;
				
				if (codeFormat === 'words') {
					code = generateWordBasedRecoveryCode();
				} else {
					const charset = getCharacterSet();
					code = generateSecureRecoveryCode(codeLength, charset);
				}
				
				codes.push({ code, used: false });
			}

			generatedCodes = codes;
		} catch (error) {
			console.error('Error generating recovery codes:', error);
			alert('Failed to generate recovery codes. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	async function copyAllCodes() {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}

		try {
			const codeText = generatedCodes.map((item, index) => 
				`${(index + 1).toString().padStart(2, '0')}. ${item.code}`
			).join('\n');

			await navigator.clipboard.writeText(codeText);
			copyButtonText = 'Copied!';
			setTimeout(() => copyButtonText = 'Copy All Codes', 2000);
		} catch (err) {
			console.error('Failed to copy codes: ', err);
		}
	}

	async function copySingleCode(code: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(code);
		} catch (err) {
			console.error('Failed to copy code: ', err);
		}
	}

	function toggleCodeUsed(index: number) {
		generatedCodes[index].used = !generatedCodes[index].used;
		generatedCodes = [...generatedCodes]; // Trigger reactivity
	}

	function downloadCodes() {
		const codeText = generatedCodes.map((item, index) => 
			`${(index + 1).toString().padStart(2, '0')}. ${item.code}`
		).join('\n');

		const header = `Recovery Codes - Generated ${new Date().toLocaleDateString()}\n` +
					   `Keep these codes secure and accessible.\n` +
					   `Each code can only be used once.\n\n`;

		const footer = `\n\nIMPORTANT:\n` +
					   `- Store these codes in a secure location\n` +
					   `- Each code can only be used once\n` +
					   `- Generate new codes after using several\n` +
					   `- Do not share these codes with anyone`;

		const fullContent = header + codeText + footer;

		const blob = new Blob([fullContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `recovery-codes-${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Generate initial codes on mount
	import { onMount } from 'svelte';
	onMount(() => {
		if (browser) {
			generateRecoveryCodes();
		}
	});
</script>

<svelte:head>
	<title>Recovery Codes Generator - MemPhrase</title>
	<meta name="description" content="Generate secure backup recovery codes for account protection. Create one-time use codes for account recovery when 2FA devices are lost or unavailable." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-2xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Recovery Codes
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-2xl">
		Generate secure backup recovery codes for account protection. These one-time use codes help you regain access 
		when your 2FA device is lost, stolen, or unavailable.
	</p>

	<!-- Configuration Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Recovery Code Settings</h2>
		
		<div class="space-y-6">
			<!-- Number of Codes -->
			<div>
				<CustomTooltip text="How many recovery codes to generate. Most services recommend 8-16 codes." position="top">
					<label for="numberOfCodes" class="block text-sm font-medium text-gray-300 mb-2">
						Number of Codes: <span class="font-bold text-green-400">{numberOfCodes}</span>
					</label>
				</CustomTooltip>
				<input 
					type="range" 
					id="numberOfCodes" 
					min="6" 
					max="20" 
					step="2"
					bind:value={numberOfCodes}
					class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-400 mt-1">
					<span>6</span>
					<span>20</span>
				</div>
			</div>

			<!-- Code Length -->
			<div>
				<CustomTooltip text="Length of each recovery code. Longer codes are more secure but harder to type." position="top">
					<label for="codeLength" class="block text-sm font-medium text-gray-300 mb-2">
						Code Length: <span class="font-bold text-green-400">{codeLength} characters</span>
					</label>
				</CustomTooltip>
				<input 
					type="range" 
					id="codeLength" 
					min="6" 
					max="16" 
					step="2"
					bind:value={codeLength}
					class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-400 mt-1">
					<span>6</span>
					<span>16</span>
				</div>
			</div>

			<!-- Code Format -->
			<fieldset>
				<CustomTooltip text="Format type for recovery codes." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">Code Format</legend>
				</CustomTooltip>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {codeFormat === 'alphanumeric' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={codeFormat} value="alphanumeric" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Mixed Characters</div>
							<div class="text-xs text-gray-400">A-Z, 0-9 (traditional)</div>
						</div>
					</label>
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {codeFormat === 'words' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={codeFormat} value="words" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Word-Based</div>
							<div class="text-xs text-gray-400">Easy to type & remember</div>
						</div>
					</label>
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {codeFormat === 'digits' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={codeFormat} value="digits" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Numbers Only</div>
							<div class="text-xs text-gray-400">0-9 only</div>
						</div>
					</label>
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {codeFormat === 'letters' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={codeFormat} value="letters" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Letters Only</div>
							<div class="text-xs text-gray-400">A-Z only</div>
						</div>
					</label>
				</div>
			</fieldset>

			<!-- Word-based Options -->
			{#if codeFormat === 'words'}
				<div class="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
					<h4 class="text-sm font-medium text-gray-300">Word-Based Options</h4>
					
					<div class="grid grid-cols-2 gap-4">
						<div>
							<CustomTooltip text="Number of words per recovery code" position="top">
								<label for="wordsPerCode" class="block text-sm font-medium text-gray-300 mb-2">
									Words per Code: <span class="font-bold text-green-400">{wordsPerCode}</span>
								</label>
							</CustomTooltip>
							<input 
								type="range" 
								id="wordsPerCode" 
								min="2" 
								max="4" 
								step="1"
								bind:value={wordsPerCode}
								class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
							/>
							<div class="flex justify-between text-xs text-gray-400 mt-1">
								<span>2</span>
								<span>4</span>
							</div>
						</div>
						
						<div>
							<CustomTooltip text="Character used to separate words" position="top">
								<label for="wordSeparator" class="block text-sm font-medium text-gray-300 mb-2">Word Separator</label>
							</CustomTooltip>
							<select 
								id="wordSeparator"
								bind:value={wordSeparator}
								class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value="-">Hyphen (-)</option>
								<option value="_">Underscore (_)</option>
								<option value=".">Period (.)</option>
								<option value="">No separator</option>
							</select>
						</div>
					</div>
					
					<div class="text-xs text-gray-400 bg-slate-800 p-3 rounded border border-slate-600">
						<strong>Example:</strong> 
						{#if codeFormat === 'words'}
							{#if wordsPerCode === 2}
								Tiger{wordSeparator}Swift
							{:else if wordsPerCode === 3}
								Tiger{wordSeparator}Moon{wordSeparator}Swift
							{:else if wordsPerCode === 4}
								Tiger{wordSeparator}Moon{wordSeparator}Swift{wordSeparator}Run
							{:else}
								Tiger{wordSeparator}Moon{wordSeparator}Swift
							{/if}
						{:else}
							Select word format to see example
						{/if}
					</div>
				</div>
			{:else}
				<!-- Include Hyphens (for character-based codes) -->
				<div>
					<CustomTooltip text="Add hyphens to make codes easier to read and type (e.g., AB12-CD34 instead of AB12CD34)." position="top">
						<label class="flex items-center gap-x-3 cursor-pointer">
							<input type="checkbox" bind:checked={includeHyphens} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-300">Include hyphens for readability</span>
						</label>
					</CustomTooltip>
				</div>
			{/if}
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateRecoveryCodes}
				disabled={isGenerating}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating Recovery Codes...
					</div>
				{:else}
					Generate New Recovery Codes
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated Codes Display -->
	{#if generatedCodes.length > 0}
		<section class="w-full space-y-6">
			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-3 justify-center">
				<button
					on:click={copyAllCodes}
					class="button-gleam rounded-md px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Copied') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
				>
					{copyButtonText}
				</button>
				<button
					on:click={downloadCodes}
					class="rounded-md border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-slate-600 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
				>
					Download as Text
				</button>
			</div>

			<!-- Codes Grid -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4 text-center">Your Recovery Codes</h3>
				
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#each generatedCodes as codeItem, index}
						<div class="flex items-center justify-between p-3 rounded-md border border-slate-600 bg-slate-700/50 {codeItem.used ? 'opacity-60' : ''}">
							<div class="flex items-center gap-3">
								<button
									on:click={() => toggleCodeUsed(index)}
									class="flex items-center justify-center w-6 h-6 rounded border-2 transition {codeItem.used ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-green-500'}"
									title={codeItem.used ? 'Mark as unused' : 'Mark as used'}
								>
									{#if codeItem.used}
										<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
										</svg>
									{/if}
								</button>
								<span class="text-sm text-gray-400 min-w-[20px]">{(index + 1).toString().padStart(2, '0')}.</span>
							</div>
							
							<button
								on:click={() => copySingleCode(codeItem.code)}
								class="font-mono text-sm bg-slate-900 px-3 py-1.5 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition {codeItem.used ? 'line-through text-gray-500' : 'text-gray-200'}"
								title="Click to copy"
							>
								{codeItem.code}
							</button>
						</div>
					{/each}
				</div>

				<!-- Usage Stats -->
				<div class="mt-6 p-4 bg-slate-700/30 rounded-lg">
					<div class="flex justify-between text-sm">
						<span class="text-gray-400">Codes remaining:</span>
						<span class="text-gray-200 font-medium">
							{generatedCodes.filter(c => !c.used).length} of {generatedCodes.length}
						</span>
					</div>
				</div>
			</div>

			<!-- Security Information -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Security Guidelines</h3>
				
				<div class="space-y-3 text-sm">
					<div class="p-3 bg-green-900/20 border border-green-500/50 rounded-md">
						<p class="text-green-300">
							<strong>✅ Secure Storage:</strong> Save these codes in a password manager or secure physical location
						</p>
					</div>
					
					<div class="p-3 bg-blue-900/20 border border-blue-500/50 rounded-md">
						<p class="text-blue-300">
							<strong>🔐 Single Use:</strong> Each code can only be used once for account recovery
						</p>
					</div>
					
					<div class="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-md">
						<p class="text-yellow-300">
							<strong>⚠️ Regenerate:</strong> Generate new codes after using several or if you suspect compromise
						</p>
					</div>

					<div class="p-3 bg-red-900/20 border border-red-500/50 rounded-md">
						<p class="text-red-300">
							<strong>🚫 Keep Private:</strong> Never share these codes with anyone or store them insecurely
						</p>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Instructions -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">How to Use Recovery Codes</h3>
		
		<div class="space-y-6">
			<!-- When to Use -->
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">When to Use Recovery Codes</h4>
				<ul class="text-sm text-gray-300 space-y-2 ml-4">
					<li class="flex items-start gap-2">
						<span class="text-yellow-400 mt-0.5">•</span>
						<span>Your 2FA device is lost, stolen, or broken</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-yellow-400 mt-0.5">•</span>
						<span>Your authenticator app is deleted or reset</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-yellow-400 mt-0.5">•</span>
						<span>You can't access your phone or SMS codes</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-yellow-400 mt-0.5">•</span>
						<span>Backup 2FA methods are unavailable</span>
					</li>
				</ul>
			</div>

			<!-- How to Use -->
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Recovery Process</h4>
				<ol class="text-sm text-gray-300 space-y-2 ml-4">
					<li class="list-decimal">Go to your service's sign-in page and enter your username/password</li>
					<li class="list-decimal">When prompted for 2FA, look for "Use recovery code" or "Can't access your device?"</li>
					<li class="list-decimal">Enter one of your unused recovery codes</li>
					<li class="list-decimal">Mark the code as used and immediately set up new 2FA</li>
					<li class="list-decimal">Generate new recovery codes to replace the used one</li>
				</ol>
			</div>

			<!-- Best Practices -->
			<div class="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
				<h4 class="text-md font-medium text-blue-400 mb-2">Best Practices</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• Print codes and store them in a safe place</li>
					<li>• Keep a digital copy in your password manager</li>
					<li>• Don't store codes on the same device as your main 2FA</li>
					<li>• Generate new codes periodically (every 6-12 months)</li>
					<li>• Test one code to ensure they work before relying on them</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			Recovery codes are generated entirely in your browser and are not stored or transmitted.
		</p>
	</div>

	<Footer />
</main>

<style>
	/* Custom range slider styling */
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-track {
		background: #4b5563;
		height: 8px;
		border-radius: 4px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		background: #22c55e;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		margin-top: -6px;
	}

	input[type='range']::-moz-range-track {
		background: #4b5563;
		height: 8px;
		border-radius: 4px;
		border: none;
	}

	input[type='range']::-moz-range-thumb {
		background: #22c55e;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
	}
</style> 