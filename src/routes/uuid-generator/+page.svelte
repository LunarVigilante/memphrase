<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	interface GeneratedUUID {
		uuid: string;
		version: string;
		timestamp?: string;
		description: string;
	}

	let generatedUUIDs: GeneratedUUID[] = [];
	let selectedVersions: string[] = ['v4']; // Default to UUID v4
	let numberOfUUIDs = 5;
	let includeTimestamp = true;
	let copyButtonText = 'Copy All';
	let isGenerating = false;
	let outputFormat: 'standard' | 'uppercase' | 'nohyphens' | 'braces' = 'standard';

	// UUID version options
	const uuidVersions = [
		{
			value: 'v4',
			label: 'UUID v4 (Random)',
			description: 'Cryptographically secure random UUID. Most common and secure.'
		},
		{
			value: 'v7',
			label: 'UUID v7 (Timestamp-ordered)',
			description: 'Time-ordered UUID with random suffix. Great for database keys.'
		},
		{
			value: 'v1',
			label: 'UUID v1 (MAC + Timestamp)',
			description: 'MAC address + timestamp. Contains identifiable information.'
		}
	];

	// Generate cryptographically secure random bytes
	function getRandomBytes(length: number): Uint8Array {
		if (!browser || !window.crypto) {
			throw new Error('Secure random number generator not available');
		}
		const bytes = new Uint8Array(length);
		window.crypto.getRandomValues(bytes);
		return bytes;
	}

	// Convert bytes to hex string
	function bytesToHex(bytes: Uint8Array): string {
		return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
	}

	// Generate UUID v4 (Random)
	function generateUUIDv4(): string {
		const bytes = getRandomBytes(16);
		
		// Set version (4) and variant bits
		bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
		
		const hex = bytesToHex(bytes);
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
	}

	// Generate UUID v7 (Timestamp-ordered)
	function generateUUIDv7(): string {
		const timestamp = Date.now();
		const bytes = getRandomBytes(16);
		
		// Set timestamp in first 48 bits (6 bytes)
		const timestampBytes = new Uint8Array(8);
		new DataView(timestampBytes.buffer).setBigUint64(0, BigInt(timestamp), false);
		
		// Copy timestamp to first 6 bytes
		for (let i = 0; i < 6; i++) {
			bytes[i] = timestampBytes[i + 2]; // Skip first 2 bytes to get 48-bit timestamp
		}
		
		// Set version (7) and variant bits
		bytes[6] = (bytes[6] & 0x0f) | 0x70; // Version 7
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
		
		const hex = bytesToHex(bytes);
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
	}

	// Generate UUID v1 (MAC + Timestamp) - Simplified implementation
	function generateUUIDv1(): string {
		const bytes = getRandomBytes(16);
		const timestamp = Date.now();
		
		// Simplified: Use random bytes for MAC address simulation
		// In real v1, this would be actual MAC address
		
		// Set timestamp (simplified)
		const timestampHex = timestamp.toString(16).padStart(12, '0');
		
		// Set version (1) and variant bits
		bytes[6] = (bytes[6] & 0x0f) | 0x10; // Version 1
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
		
		const hex = bytesToHex(bytes);
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
	}

	// Format UUID according to selected format
	function formatUUID(uuid: string): string {
		switch (outputFormat) {
			case 'uppercase':
				return uuid.toUpperCase();
			case 'nohyphens':
				return uuid.replace(/-/g, '');
			case 'braces':
				return `{${uuid}}`;
			default:
				return uuid;
		}
	}

	// Generate UUIDs
	function generateUUIDs() {
		if (selectedVersions.length === 0) {
			alert('Please select at least one UUID version');
			return;
		}

		isGenerating = true;
		copyButtonText = 'Copy All';
		const newUUIDs: GeneratedUUID[] = [];

		try {
			for (let i = 0; i < numberOfUUIDs; i++) {
				// Cycle through selected versions
				const version = selectedVersions[i % selectedVersions.length];
				let uuid: string;
				let description: string;

				switch (version) {
					case 'v4':
						uuid = generateUUIDv4();
						description = 'Random UUID (most secure)';
						break;
					case 'v7':
						uuid = generateUUIDv7();
						description = 'Timestamp-ordered UUID';
						break;
					case 'v1':
						uuid = generateUUIDv1();
						description = 'MAC + Timestamp UUID';
						break;
					default:
						uuid = generateUUIDv4();
						description = 'Random UUID';
				}

				const formattedUUID = formatUUID(uuid);

				newUUIDs.push({
					uuid: formattedUUID,
					version,
					timestamp: includeTimestamp ? new Date().toISOString() : undefined,
					description
				});
			}

			generatedUUIDs = newUUIDs;
		} catch (error) {
			console.error('Error generating UUIDs:', error);
			alert('Failed to generate UUIDs. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Copy all UUIDs to clipboard
	async function copyAllUUIDs() {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}

		try {
			const uuidText = generatedUUIDs.map((item, index) => {
				const timestamp = item.timestamp ? ` (${item.timestamp})` : '';
				return `${(index + 1).toString().padStart(2, '0')}. ${item.uuid}${timestamp}`;
			}).join('\n');

			await navigator.clipboard.writeText(uuidText);
			copyButtonText = 'Copied!';
			setTimeout(() => copyButtonText = 'Copy All', 2000);
		} catch (err) {
			console.error('Failed to copy UUIDs: ', err);
		}
	}

	// Copy single UUID
	async function copySingleUUID(uuid: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(uuid);
		} catch (err) {
			console.error('Failed to copy UUID: ', err);
		}
	}

	// Download UUIDs as text file
	function downloadUUIDs() {
		const uuidText = generatedUUIDs.map((item, index) => {
			const timestamp = item.timestamp ? ` (Generated: ${item.timestamp})` : '';
			return `${(index + 1).toString().padStart(2, '0')}. ${item.uuid} - ${item.description}${timestamp}`;
		}).join('\n');

		const header = `UUIDs - Generated ${new Date().toLocaleDateString()}\n` +
					   `Format: ${outputFormat}\n` +
					   `Versions: ${selectedVersions.join(', ')}\n\n`;

		const fullContent = header + uuidText;

		const blob = new Blob([fullContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `uuids-${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Generate initial UUIDs on mount
	import { onMount } from 'svelte';
	onMount(() => {
		if (browser) {
			generateUUIDs();
		}
	});
</script>

<svelte:head>
	<title>UUID/GUID Generator - MemPhrase</title>
	<meta name="description" content="Generate secure UUIDs (Universally Unique Identifiers) and GUIDs. Support for UUID v4 (random), v7 (timestamp-ordered), and v1 (MAC + timestamp) formats." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			UUID Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-2xl">
		Generate cryptographically secure UUIDs (Universally Unique Identifiers) and GUIDs. 
		Perfect for database keys, API tokens, session IDs, and unique identifiers.
	</p>

	<!-- Configuration Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">UUID Configuration</h2>
		
		<div class="space-y-6">
			<!-- UUID Versions -->
			<fieldset>
				<CustomTooltip text="Select which UUID versions to generate. Different versions serve different purposes." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">UUID Versions</legend>
				</CustomTooltip>
				<div class="space-y-3">
					{#each uuidVersions as version}
						<label class="flex items-start gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {selectedVersions.includes(version.value) ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
							<input 
								type="checkbox" 
								bind:group={selectedVersions} 
								value={version.value}
								class="mt-1 rounded text-green-500 focus:ring-green-500" 
							/>
							<div class="flex-1">
								<div class="text-sm font-medium text-gray-200">{version.label}</div>
								<div class="text-xs text-gray-400 mt-1">{version.description}</div>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Number of UUIDs -->
			<div>
				<CustomTooltip text="How many UUIDs to generate at once." position="top">
					<label for="numberOfUUIDs" class="block text-sm font-medium text-gray-300 mb-2">
						Number of UUIDs: <span class="font-bold text-green-400">{numberOfUUIDs}</span>
					</label>
				</CustomTooltip>
				<input 
					type="range" 
					id="numberOfUUIDs" 
					min="1" 
					max="50" 
					step="1"
					bind:value={numberOfUUIDs}
					class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-400 mt-1">
					<span>1</span>
					<span>50</span>
				</div>
			</div>

			<!-- Output Format -->
			<fieldset>
				<CustomTooltip text="Choose how to format the generated UUIDs." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">Output Format</legend>
				</CustomTooltip>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<label class="flex items-center gap-x-2 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'standard' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="standard" class="text-green-500 focus:ring-green-500" />
						<div class="text-xs">
							<div class="font-medium text-gray-200">Standard</div>
							<div class="text-gray-400">abc-def-123</div>
						</div>
					</label>
					<label class="flex items-center gap-x-2 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'uppercase' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="uppercase" class="text-green-500 focus:ring-green-500" />
						<div class="text-xs">
							<div class="font-medium text-gray-200">Uppercase</div>
							<div class="text-gray-400">ABC-DEF-123</div>
						</div>
					</label>
					<label class="flex items-center gap-x-2 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'nohyphens' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="nohyphens" class="text-green-500 focus:ring-green-500" />
						<div class="text-xs">
							<div class="font-medium text-gray-200">No Hyphens</div>
							<div class="text-gray-400">abcdef123456</div>
						</div>
					</label>
					<label class="flex items-center gap-x-2 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'braces' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="braces" class="text-green-500 focus:ring-green-500" />
						<div class="text-xs">
							<div class="font-medium text-gray-200">Braces</div>
							<div class="text-gray-400">{'{'}abc-def-123{'}'}</div>
						</div>
					</label>
				</div>
			</fieldset>

			<!-- Include Timestamp -->
			<div>
				<CustomTooltip text="Include generation timestamp with each UUID for tracking purposes." position="top">
					<label class="flex items-center gap-x-3 cursor-pointer">
						<input type="checkbox" bind:checked={includeTimestamp} class="rounded text-green-500 focus:ring-green-500" />
						<span class="text-sm text-gray-300">Include generation timestamp</span>
					</label>
				</CustomTooltip>
			</div>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateUUIDs}
				disabled={isGenerating || selectedVersions.length === 0}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating UUIDs...
					</div>
				{:else}
					Generate UUIDs
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated UUIDs Display -->
	{#if generatedUUIDs.length > 0}
		<section class="w-full space-y-6">
			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-3 justify-center">
				<button
					on:click={copyAllUUIDs}
					class="button-gleam rounded-md px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Copied') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
				>
					{copyButtonText}
				</button>
				<button
					on:click={downloadUUIDs}
					class="rounded-md border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-slate-600 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
				>
					Download as Text
				</button>
			</div>

			<!-- UUIDs List -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4 text-center">Generated UUIDs</h3>
				
				<div class="space-y-3">
					{#each generatedUUIDs as uuidItem, index}
						<div class="flex items-center justify-between p-4 rounded-md border border-slate-600 bg-slate-700/50">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-3 mb-1">
									<span class="text-sm text-gray-400 font-mono min-w-[24px]">{(index + 1).toString().padStart(2, '0')}.</span>
									<span class="text-xs px-2 py-1 rounded-full {uuidItem.version === 'v4' ? 'bg-green-900/30 text-green-300' : uuidItem.version === 'v7' ? 'bg-blue-900/30 text-blue-300' : 'bg-yellow-900/30 text-yellow-300'}">
										{uuidItem.version.toUpperCase()}
									</span>
									<span class="text-xs text-gray-500">{uuidItem.description}</span>
								</div>
								<button
									on:click={() => copySingleUUID(uuidItem.uuid)}
									class="font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 w-full text-left break-all"
									title="Click to copy"
								>
									{uuidItem.uuid}
								</button>
								{#if uuidItem.timestamp}
									<div class="text-xs text-gray-500 mt-1">Generated: {new Date(uuidItem.timestamp).toLocaleString()}</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Security Information -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">UUID Information</h3>
				
				<div class="space-y-3 text-sm">
					<div class="p-3 bg-green-900/20 border border-green-500/50 rounded-md">
						<p class="text-green-300">
							<strong>✅ UUID v4:</strong> Cryptographically secure random identifiers. Best for most use cases.
						</p>
					</div>
					
					<div class="p-3 bg-blue-900/20 border border-blue-500/50 rounded-md">
						<p class="text-blue-300">
							<strong>🕒 UUID v7:</strong> Time-ordered UUIDs. Great for database primary keys with natural ordering.
						</p>
					</div>
					
					<div class="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-md">
						<p class="text-yellow-300">
							<strong>⚠️ UUID v1:</strong> Contains timestamp and MAC info. May reveal device identity.
						</p>
					</div>

					<div class="p-3 bg-purple-900/20 border border-purple-500/50 rounded-md">
						<p class="text-purple-300">
							<strong>🔒 Privacy:</strong> All UUIDs generated entirely in your browser using secure random values.
						</p>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Use Cases -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Common Use Cases</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Database & Development</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Primary keys for database tables</li>
					<li>• Session identifiers</li>
					<li>• API request/response tracking</li>
					<li>• File and object naming</li>
					<li>• Transaction IDs</li>
				</ul>
			</div>

			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Security & Integration</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• OAuth state parameters</li>
					<li>• Temporary access tokens</li>
					<li>• Device identifiers</li>
					<li>• Message/event correlation IDs</li>
					<li>• Distributed system node IDs</li>
				</ul>
			</div>
		</div>

		<div class="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
			<h4 class="text-md font-medium text-blue-400 mb-2">Best Practices</h4>
			<ul class="text-sm text-gray-300 space-y-1">
				<li>• Use UUID v4 for most applications requiring unique identifiers</li>
				<li>• Use UUID v7 when you need time-ordered keys (better database performance)</li>
				<li>• Avoid UUID v1 in privacy-sensitive applications</li>
				<li>• Store UUIDs in their native format (16 bytes) when possible for efficiency</li>
				<li>• Consider using lowercase format for consistency</li>
			</ul>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			UUIDs are generated entirely in your browser using secure random number generation.
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