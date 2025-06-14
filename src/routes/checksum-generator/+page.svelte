<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	interface ChecksumResult {
		algorithm: string;
		hash: string;
		description: string;
	}

	let inputText = '';
	let selectedFile: File | null = null;
	let inputMode: 'text' | 'file' = 'text';
	let selectedAlgorithms: string[] = ['SHA-256']; // Default to SHA-256
	let outputFormat: 'lowercase' | 'uppercase' = 'lowercase';
	let generatedChecksums: ChecksumResult[] = [];
	let isGenerating = false;
	let copyButtonText = 'Copy All';

	// Algorithm options with descriptions
	const algorithms = [
		{
			value: 'MD5',
			label: 'MD5 (128-bit)',
			description: 'Fast but cryptographically broken. Use only for non-security purposes.',
			deprecated: true
		},
		{
			value: 'SHA-1',
			label: 'SHA-1 (160-bit)',
			description: 'Deprecated for security use. Vulnerable to collision attacks.',
			deprecated: true
		},
		{
			value: 'SHA-256',
			label: 'SHA-256 (256-bit)',
			description: 'Secure and widely used. Recommended for most applications.',
			deprecated: false
		},
		{
			value: 'SHA-512',
			label: 'SHA-512 (512-bit)',
			description: 'Very secure with larger output. Good for high-security applications.',
			deprecated: false
		}
	];

	// Convert array buffer to hex string
	function arrayBufferToHex(buffer: ArrayBuffer): string {
		const byteArray = new Uint8Array(buffer);
		const hexCodes = Array.from(byteArray, byte => 
			byte.toString(16).padStart(2, '0')
		);
		return hexCodes.join('');
	}

	// Generate hash for given algorithm
	async function generateHash(data: ArrayBuffer | Uint8Array, algorithm: string): Promise<string> {
		if (!browser || !window.crypto || !window.crypto.subtle) {
			throw new Error('Web Crypto API not available');
		}

		let hashBuffer: ArrayBuffer;

		switch (algorithm) {
			case 'SHA-256':
				hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
				break;
			case 'SHA-512':
				hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
				break;
			case 'SHA-1':
				hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
				break;
			case 'MD5':
				// MD5 is not supported by Web Crypto API, we'll use a simplified approach
				// In a real implementation, you'd use a library like crypto-js
				throw new Error('MD5 not supported by Web Crypto API. Use SHA-256 instead.');
			default:
				throw new Error(`Unsupported algorithm: ${algorithm}`);
		}

		let hex = arrayBufferToHex(hashBuffer);
		return outputFormat === 'uppercase' ? hex.toUpperCase() : hex;
	}

	// Format hash output
	function formatHash(hash: string): string {
		return outputFormat === 'uppercase' ? hash.toUpperCase() : hash.toLowerCase();
	}

	// Generate checksums
	async function generateChecksums() {
		if (selectedAlgorithms.length === 0) {
			alert('Please select at least one hash algorithm');
			return;
		}

		if (inputMode === 'text' && !inputText.trim()) {
			alert('Please enter some text to hash');
			return;
		}

		if (inputMode === 'file' && !selectedFile) {
			alert('Please select a file to hash');
			return;
		}

		isGenerating = true;
		copyButtonText = 'Copy All';
		const results: ChecksumResult[] = [];

		try {
			let data: ArrayBuffer | Uint8Array;

			if (inputMode === 'text') {
				// Convert text to Uint8Array (which works with Web Crypto API)
				const encoder = new TextEncoder();
				data = encoder.encode(inputText);
			} else {
				// Read file as ArrayBuffer
				data = await selectedFile!.arrayBuffer();
			}

			// Generate hashes for each selected algorithm
			for (const algorithm of selectedAlgorithms) {
				try {
					const hash = await generateHash(data, algorithm);
					const algorithmInfo = algorithms.find(a => a.value === algorithm);
					
					results.push({
						algorithm,
						hash: formatHash(hash),
						description: algorithmInfo?.description || ''
					});
				} catch (error) {
					console.error(`Error generating ${algorithm} hash:`, error);
					results.push({
						algorithm,
						hash: 'Error: ' + (error as Error).message,
						description: 'Failed to generate hash'
					});
				}
			}

			generatedChecksums = results;
		} catch (error) {
			console.error('Error generating checksums:', error);
			alert('Failed to generate checksums. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Copy all checksums to clipboard
	async function copyAllChecksums() {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}

		try {
			const checksumText = generatedChecksums.map((item, index) => 
				`${item.algorithm}: ${item.hash}`
			).join('\n');

			await navigator.clipboard.writeText(checksumText);
			copyButtonText = 'Copied!';
			setTimeout(() => copyButtonText = 'Copy All', 2000);
		} catch (err) {
			console.error('Failed to copy checksums: ', err);
		}
	}

	// Copy single checksum
	async function copySingleChecksum(hash: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(hash);
		} catch (err) {
			console.error('Failed to copy checksum: ', err);
		}
	}

	// Download checksums as text file
	function downloadChecksums() {
		const inputInfo = inputMode === 'text' 
			? `Text: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`
			: `File: ${selectedFile?.name || 'Unknown'}`;

		const checksumText = generatedChecksums.map((item) => 
			`${item.algorithm}: ${item.hash}`
		).join('\n');

		const header = `Checksums - Generated ${new Date().toLocaleDateString()}\n` +
					   `Input: ${inputInfo}\n` +
					   `Format: ${outputFormat}\n\n`;

		const footer = `\n\nGenerated by MemPhrase Checksum Generator\n` +
					   `Always verify checksums from trusted sources.`;

		const fullContent = header + checksumText + footer;

		const blob = new Blob([fullContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `checksums-${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Handle file selection
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
		}
	}

	// Clear file selection
	function clearFileSelection() {
		selectedFile = null;
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// Format file size
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}
</script>

<svelte:head>
	<title>Checksum Generator - MemPhrase</title>
	<meta name="description" content="Generate secure checksums and hashes for text and files. Support for SHA-256, SHA-512, SHA-1, and MD5 algorithms for data integrity verification." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Checksum Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-2xl">
		Generate secure checksums and hashes for data integrity verification. 
		Support for SHA-256, SHA-512, SHA-1, and MD5 algorithms for text and files.
	</p>

	<!-- Configuration Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Checksum Configuration</h2>
		
		<div class="space-y-6">
			<!-- Input Mode Selection -->
			<fieldset>
				<CustomTooltip text="Choose whether to hash text input or a file." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">Input Type</legend>
				</CustomTooltip>
				<div class="grid grid-cols-2 gap-3">
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {inputMode === 'text' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={inputMode} value="text" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Text Input</div>
							<div class="text-xs text-gray-400">Hash text directly</div>
						</div>
					</label>
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {inputMode === 'file' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={inputMode} value="file" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">File Upload</div>
							<div class="text-xs text-gray-400">Hash file contents</div>
						</div>
					</label>
				</div>
			</fieldset>

			<!-- Text Input -->
			{#if inputMode === 'text'}
				<div>
					<CustomTooltip text="Enter the text you want to generate checksums for." position="top">
						<label for="inputText" class="block text-sm font-medium text-gray-300 mb-2">Text to Hash</label>
					</CustomTooltip>
					<textarea 
						id="inputText"
						bind:value={inputText}
						placeholder="Enter text to generate checksums..."
						rows="4"
						class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
					></textarea>
					{#if inputText}
						<div class="text-xs text-gray-400 mt-1">
							Length: {inputText.length} characters
						</div>
					{/if}
				</div>
			{/if}

			<!-- File Input -->
			{#if inputMode === 'file'}
				<div>
					<CustomTooltip text="Select a file to generate checksums for. All file types are supported." position="top">
						<label for="fileInput" class="block text-sm font-medium text-gray-300 mb-2">File to Hash</label>
					</CustomTooltip>
					<div class="space-y-3">
						<input 
							type="file" 
							id="fileInput"
							on:change={handleFileSelect}
							class="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
						/>
						{#if selectedFile}
							<div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-md border border-slate-600">
								<div>
									<div class="text-sm font-medium text-gray-200">{selectedFile.name}</div>
									<div class="text-xs text-gray-400">
										{formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
									</div>
								</div>
								<button
									on:click={clearFileSelection}
									class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20"
								>
									Remove
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Hash Algorithms -->
			<fieldset>
				<CustomTooltip text="Select which hash algorithms to use. SHA-256 and SHA-512 are recommended for security." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">Hash Algorithms</legend>
				</CustomTooltip>
				<div class="space-y-3">
					{#each algorithms as algorithm}
						<label class="flex items-start gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {selectedAlgorithms.includes(algorithm.value) ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'} {algorithm.deprecated ? 'opacity-75' : ''}">
							<input 
								type="checkbox" 
								bind:group={selectedAlgorithms} 
								value={algorithm.value}
								class="mt-1 rounded text-green-500 focus:ring-green-500" 
							/>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-gray-200">{algorithm.label}</span>
									{#if algorithm.deprecated}
										<span class="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-300">Deprecated</span>
									{/if}
								</div>
								<div class="text-xs text-gray-400 mt-1">{algorithm.description}</div>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Output Format -->
			<fieldset>
				<CustomTooltip text="Choose the case format for the generated hash values." position="top">
					<legend class="block text-sm font-medium text-gray-300 mb-3">Output Format</legend>
				</CustomTooltip>
				<div class="grid grid-cols-2 gap-3">
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'lowercase' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="lowercase" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Lowercase</div>
							<div class="text-xs text-gray-400">a1b2c3d4...</div>
						</div>
					</label>
					<label class="flex items-center gap-x-3 cursor-pointer p-3 rounded-md border border-slate-600 hover:border-slate-500 {outputFormat === 'uppercase' ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50'}">
						<input type="radio" bind:group={outputFormat} value="uppercase" class="text-green-500 focus:ring-green-500" />
						<div>
							<div class="text-sm font-medium text-gray-200">Uppercase</div>
							<div class="text-xs text-gray-400">A1B2C3D4...</div>
						</div>
					</label>
				</div>
			</fieldset>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateChecksums}
				disabled={isGenerating || selectedAlgorithms.length === 0 || (inputMode === 'text' && !inputText.trim()) || (inputMode === 'file' && !selectedFile)}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating Checksums...
					</div>
				{:else}
					Generate Checksums
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated Checksums Display -->
	{#if generatedChecksums.length > 0}
		<section class="w-full space-y-6">
			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-3 justify-center">
				<button
					on:click={copyAllChecksums}
					class="button-gleam rounded-md px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Copied') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
				>
					{copyButtonText}
				</button>
				<button
					on:click={downloadChecksums}
					class="rounded-md border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-slate-600 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
				>
					Download as Text
				</button>
			</div>

			<!-- Checksums List -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4 text-center">Generated Checksums</h3>
				
				<div class="space-y-3">
					{#each generatedChecksums as checksum, index}
						<div class="p-4 rounded-md border border-slate-600 bg-slate-700/50">
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-3">
									<span class="text-sm font-medium text-gray-200">{checksum.algorithm}</span>
									{#if algorithms.find(a => a.value === checksum.algorithm)?.deprecated}
										<span class="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-300">Deprecated</span>
									{/if}
								</div>
							</div>
							
							<button
								on:click={() => copySingleChecksum(checksum.hash)}
								class="w-full font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 text-left break-all"
								title="Click to copy"
							>
								{checksum.hash}
							</button>
							
							{#if checksum.description}
								<div class="text-xs text-gray-400 mt-2">{checksum.description}</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Security Information -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Security Information</h3>
				
				<div class="space-y-3 text-sm">
					<div class="p-3 bg-green-900/20 border border-green-500/50 rounded-md">
						<p class="text-green-300">
							<strong>✅ SHA-256/SHA-512:</strong> Cryptographically secure and recommended for integrity verification
						</p>
					</div>
					
					<div class="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-md">
						<p class="text-yellow-300">
							<strong>⚠️ SHA-1:</strong> Deprecated for security use. Vulnerable to collision attacks
						</p>
					</div>
					
					<div class="p-3 bg-red-900/20 border border-red-500/50 rounded-md">
						<p class="text-red-300">
							<strong>❌ MD5:</strong> Cryptographically broken. Not supported (use SHA-256 instead)
						</p>
					</div>

					<div class="p-3 bg-blue-900/20 border border-blue-500/50 rounded-md">
						<p class="text-blue-300">
							<strong>🔒 Privacy:</strong> All hashing performed locally in your browser - no data transmitted
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
				<h4 class="text-md font-medium text-green-400 mb-2">Data Integrity</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Verify downloaded files haven't been corrupted</li>
					<li>• Check file integrity after transfer</li>
					<li>• Detect unauthorized file modifications</li>
					<li>• Backup verification and validation</li>
				</ul>
			</div>

			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Security & Development</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Compare checksums from trusted sources</li>
					<li>• Software distribution verification</li>
					<li>• Digital forensics and evidence handling</li>
					<li>• Version control and change detection</li>
				</ul>
			</div>
		</div>

		<div class="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
			<h4 class="text-md font-medium text-blue-400 mb-2">Best Practices</h4>
			<ul class="text-sm text-gray-300 space-y-1">
				<li>• Always use SHA-256 or SHA-512 for security-critical applications</li>
				<li>• Verify checksums from multiple trusted sources when possible</li>
				<li>• Store checksums separately from the data they verify</li>
				<li>• Use different hash algorithms for additional verification</li>
				<li>• Avoid MD5 and SHA-1 for new security applications</li>
			</ul>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			All checksum generation is performed entirely in your browser using the Web Crypto API.
		</p>
	</div>

	<Footer />
</main> 