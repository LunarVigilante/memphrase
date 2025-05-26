<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte'; // Assuming you might want tooltips
	import Footer from '$lib/components/Footer.svelte';

	let keyLengthInput = 32;
	let lengthUnit: 'bytes' | 'bits' = 'bytes';
	let encodingFormat: 'base64url' | 'base64' | 'hex' = 'base64url';
	let generatedKey = '';
	let copyButtonText = 'Copy';
	let errorMessage = '';
	
	// New security level and purpose settings
	let securityLevel: 'standard' | 'high' | 'maximum' | 'custom' = 'standard';
	let keyPurpose: 'api' | 'jwt' | 'encryption' | 'session' | 'webhook' | 'general' = 'general';
	
	// Predefined security levels
	const securityLevels = {
		standard: { bytes: 32, description: 'Good for most applications (32 bytes / 256 bits)' },
		high: { bytes: 48, description: 'Enhanced security (48 bytes / 384 bits)' },
		maximum: { bytes: 64, description: 'Maximum security (64 bytes / 512 bits)' },
		custom: { bytes: null, description: 'Custom length - you choose' }
	};
	
	// Purpose-specific recommendations
	const purposeRecommendations = {
		api: { bytes: 32, format: 'base64url' as const, description: 'Secure API authentication keys for REST endpoints and bearer tokens' },
		jwt: { bytes: 32, format: 'base64' as const, description: 'Strong signing secrets for JSON Web Tokens (HMAC-SHA256)' },
		encryption: { bytes: 32, format: 'hex' as const, description: 'AES-256 encryption keys for symmetric cryptography' },
		session: { bytes: 32, format: 'base64url' as const, description: 'Unique session identifiers with high entropy for user authentication' },
		webhook: { bytes: 32, format: 'hex' as const, description: 'HMAC signing secrets for webhook payload verification' },
		general: { bytes: 32, format: 'base64url' as const, description: 'Versatile cryptographic keys suitable for various security applications' }
	};

	const MIN_BYTES = 16;
	const MAX_BYTES = 128;
	
	// Enhanced reactive logic for security level and unit changes
	$: {
		if (securityLevel !== 'custom' && securityLevels[securityLevel].bytes) {
			const targetBytes = securityLevels[securityLevel].bytes;
			keyLengthInput = lengthUnit === 'bytes' ? targetBytes : targetBytes * 8;
		}
	}
	
	// Watch for length unit changes and convert current value
	$: {
		if (securityLevel !== 'custom') {
			// Don't override if we're in custom mode
			const targetBytes = securityLevels[securityLevel].bytes;
			if (targetBytes) {
				keyLengthInput = lengthUnit === 'bytes' ? targetBytes : targetBytes * 8;
			}
		} else {
			// If in custom mode, convert the current value when units change
			// This is a bit tricky to implement properly without causing infinite loops
			// For now, we'll let the user manually adjust in custom mode
		}
	}
	
	// Watch for purpose changes - but don't override security level selections
	$: if (keyPurpose && purposeRecommendations[keyPurpose]) {
		const recommendation = purposeRecommendations[keyPurpose];
		encodingFormat = recommendation.format;
		// Only auto-adjust length if we're not in custom mode
		if (securityLevel !== 'custom') {
			const targetBytes = securityLevels[securityLevel].bytes || recommendation.bytes;
			keyLengthInput = lengthUnit === 'bytes' ? targetBytes : targetBytes * 8;
		}
	}
	
	// Helper to get the current length in bytes for display
	$: currentBytesForDisplay = lengthUnit === 'bytes' ? keyLengthInput : Math.ceil(keyLengthInput / 8);
	$: currentBitsForDisplay = lengthUnit === 'bits' ? keyLengthInput : keyLengthInput * 8;

	function toHexString(byteArray: Uint8Array): string {
		return Array.from(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
	}

	function toBase64(byteArray: Uint8Array, urlSafe = false): string {
		let binaryString = '';
		byteArray.forEach(byte => {
			binaryString += String.fromCharCode(byte);
		});
		let base64 = btoa(binaryString);
		if (urlSafe) {
			base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
		}
		return base64;
	}

	function generateAndDisplayKey() {
		errorMessage = '';
		generatedKey = '';
		copyButtonText = 'Copy';

		let bytesToGenerate = lengthUnit === 'bytes' ? keyLengthInput : Math.ceil(keyLengthInput / 8);

		if (isNaN(bytesToGenerate) || bytesToGenerate < MIN_BYTES || bytesToGenerate > MAX_BYTES) {
			errorMessage = `Invalid key length. Must be between ${MIN_BYTES * (lengthUnit === 'bits' ? 8 : 1)} and ${MAX_BYTES * (lengthUnit === 'bits' ? 8 : 1)} ${lengthUnit}.`;
			return;
		}

		if (!browser || !window.crypto || !window.crypto.getRandomValues) {
			errorMessage = 'Secure random number generator not available in this browser.';
			return;
		}

		try {
			const randomBytes = new Uint8Array(bytesToGenerate);
			window.crypto.getRandomValues(randomBytes);

			switch (encodingFormat) {
				case 'base64url':
					generatedKey = toBase64(randomBytes, true);
					break;
				case 'base64':
					generatedKey = toBase64(randomBytes, false);
					break;
				case 'hex':
					generatedKey = toHexString(randomBytes);
					break;
			}
		} catch (e) {
			console.error("Error generating key:", e);
			errorMessage = "Failed to generate key. Please try again.";
		}
	}

	async function copyKeyToClipboard() {
		if (!generatedKey || !navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(generatedKey);
			copyButtonText = 'Copied!';
			setTimeout(() => (copyButtonText = 'Copy'), 2000);
		} catch (err) {
			console.error('Failed to copy key: ', err);
			copyButtonText = 'Error';
			setTimeout(() => (copyButtonText = 'Copy'), 2000);
		}
	}

	// Call once on mount for initial default key
	onMount(() => {
		if (browser) { // Ensure crypto is available
			generateAndDisplayKey();
		}
	});
</script>

<svelte:head>
	<title>Secret Key Generator - MemPhrase</title>
	<meta name="description" content="Generate strong, random cryptographic keys (Base64, Base64URL, Hex) for your applications." />
</svelte:head>

<div class="container mx-auto max-w-2xl p-4 md:p-6 text-slate-200">
	<div class="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6 md:p-8">
		<div class="prose prose-invert prose-sm md:prose-base max-w-none text-center mb-6">
			<h1 class="text-3xl font-bold text-slate-100 mb-3">Secret Key Generator</h1>
			<p class="text-lg text-slate-300">
				Generate strong, random cryptographic keys for your applications, APIs, and services.
			</p>
		</div>

		<div class="space-y-4 max-w-md mx-auto">
			<!-- Key Purpose Section -->
			<div>
				<label for="keyPurpose" class="block text-sm font-medium text-slate-300 mb-2">Key Purpose</label>
				<CustomTooltip text="Select your use case for optimal key settings" position="top">
					<select
						id="keyPurpose"
						bind:value={keyPurpose}
						class="block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5"
					>
						<option value="general">General Purpose</option>
						<option value="api">API Authentication</option>
						<option value="jwt">JWT Signing Secret</option>
						<option value="encryption">Encryption Key (AES)</option>
						<option value="session">Session Token</option>
						<option value="webhook">Webhook Signature</option>
					</select>
				</CustomTooltip>
				{#if purposeRecommendations[keyPurpose]}
					<p class="mt-1.5 text-xs text-slate-400 leading-relaxed">{purposeRecommendations[keyPurpose].description}</p>
				{/if}
			</div>

			<!-- Security Level Section -->
			<fieldset>
				<legend class="block text-sm font-medium text-slate-300 mb-3">Security Level</legend>
				<div class="grid grid-cols-2 gap-2.5">
					<CustomTooltip text={securityLevels.standard.description} position="top">
						<label class="flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md hover:bg-slate-700 {securityLevel === 'standard' ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'} transition-colors">
							<input type="radio" bind:group={securityLevel} name="securityLevel" value="standard" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
							<span class="text-sm">Standard</span>
						</label>
					</CustomTooltip>
					<CustomTooltip text={securityLevels.high.description} position="top">
						<label class="flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md hover:bg-slate-700 {securityLevel === 'high' ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'} transition-colors">
							<input type="radio" bind:group={securityLevel} name="securityLevel" value="high" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
							<span class="text-sm">High</span>
						</label>
					</CustomTooltip>
					<CustomTooltip text={securityLevels.maximum.description} position="top">
						<label class="flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md hover:bg-slate-700 {securityLevel === 'maximum' ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'} transition-colors">
							<input type="radio" bind:group={securityLevel} name="securityLevel" value="maximum" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
							<span class="text-sm">Maximum</span>
						</label>
					</CustomTooltip>
					<CustomTooltip text={securityLevels.custom.description} position="top">
						<label class="flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md hover:bg-slate-700 {securityLevel === 'custom' ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'} transition-colors">
							<input type="radio" bind:group={securityLevel} name="securityLevel" value="custom" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
							<span class="text-sm">Custom</span>
						</label>
					</CustomTooltip>
				</div>
			</fieldset>

			<!-- Key Length Section -->
			<div>
				<label for="keyLengthInput" class="block text-sm font-medium text-slate-300 mb-2">
					Key Length
					{#if securityLevel !== 'custom'}
						<span class="text-xs text-green-400 ml-1">(Auto-set by security level)</span>
					{/if}
				</label>
				<div class="flex items-center gap-x-3 mb-2">
					<input 
						type="number" 
						id="keyLengthInput" 
						name="keyLength" 
						bind:value={keyLengthInput} 
						min={lengthUnit === 'bytes' ? MIN_BYTES : MIN_BYTES * 8} 
						max={lengthUnit === 'bytes' ? MAX_BYTES : MAX_BYTES * 8}
						disabled={securityLevel !== 'custom'}
						class="block w-24 rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<div class="flex gap-x-3">
						<label class="flex items-center gap-x-1.5 cursor-pointer">
							<input type="radio" name="lengthUnitRadio" value="bytes" bind:group={lengthUnit} class="custom-radio focus:ring-green-500 focus:ring-offset-slate-800" disabled={securityLevel !== 'custom'} />
							<span class="text-sm text-slate-300">Bytes</span>
						</label>
						<label class="flex items-center gap-x-1.5 cursor-pointer">
							<input type="radio" name="lengthUnitRadio" value="bits" bind:group={lengthUnit} class="custom-radio focus:ring-green-500 focus:ring-offset-slate-800" disabled={securityLevel !== 'custom'} />
							<span class="text-sm text-slate-300">Bits</span>
						</label>
					</div>
				</div>
				<div class="text-xs text-slate-400 bg-slate-700/30 rounded p-2 space-y-0.5">
					<p><span class="text-slate-300">Current:</span> {currentBytesForDisplay} bytes ({currentBitsForDisplay} bits)</p>
					<p><span class="text-slate-300">Range:</span> {MIN_BYTES}-{MAX_BYTES} bytes ({MIN_BYTES * 8}-{MAX_BYTES * 8} bits)</p>
				</div>
			</div>

			<!-- Encoding Format Section -->
			<fieldset>
				<legend class="block text-sm font-medium text-slate-300 mb-2">Encoding Format</legend>
				<div class="flex flex-col sm:flex-row gap-2 sm:gap-x-4">
					<CustomTooltip text="URL-safe encoding (no padding). Best for URLs and tokens." position="top">
						<label class="flex items-center gap-x-1.5 cursor-pointer p-1.5 sm:p-0">
							<input type="radio" name="encodingFormatRadio" value="base64url" bind:group={encodingFormat} class="custom-radio focus:ring-green-500 focus:ring-offset-slate-800" />
							<span class="text-sm text-slate-300">Base64URL</span>
						</label>
					</CustomTooltip>
					<CustomTooltip text="Standard Base64 encoding. Common for APIs and config files." position="top">
						<label class="flex items-center gap-x-1.5 cursor-pointer p-1.5 sm:p-0">
							<input type="radio" name="encodingFormatRadio" value="base64" bind:group={encodingFormat} class="custom-radio focus:ring-green-500 focus:ring-offset-slate-800" />
							<span class="text-sm text-slate-300">Base64</span>
						</label>
					</CustomTooltip>
					<CustomTooltip text="Hexadecimal encoding. Best for encryption keys and signatures." position="top">
						<label class="flex items-center gap-x-1.5 cursor-pointer p-1.5 sm:p-0">
							<input type="radio" name="encodingFormatRadio" value="hex" bind:group={encodingFormat} class="custom-radio focus:ring-green-500 focus:ring-offset-slate-800" />
							<span class="text-sm text-slate-300">Hexadecimal</span>
						</label>
					</CustomTooltip>
				</div>
			</fieldset>

			<!-- Generate Button -->
			<div class="pt-4">
				<button 
					type="button" 
					on:click={generateAndDisplayKey}
					class="button-gleam w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-800"
				>
					Generate Secret Key
				</button>
			</div>

			<!-- Output Section -->
			{#if errorMessage}
				<p class="text-red-400 text-sm text-center mt-2">{errorMessage}</p>
			{/if}

			{#if generatedKey}
				<div class="pt-2">
					<label for="generatedKeyOutput" class="block text-sm font-medium text-slate-300 mb-2">Generated Key:</label>
					<div class="relative">
						<textarea 
							id="generatedKeyOutput" 
							readonly 
							rows="3" 
							bind:value={generatedKey}
							class="block w-full rounded-md border-slate-600 bg-slate-900/50 text-slate-100 font-mono text-sm shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 pr-12 break-all"
							placeholder="Your generated key will appear here..."
						></textarea>
						<button 
							type="button" 
							on:click={copyKeyToClipboard}
							class="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-slate-600 hover:bg-slate-500 text-slate-200 transition-colors"
							title="Copy Key"
						>
							{copyButtonText}
						</button>
					</div>
					<p class="mt-2 text-xs text-slate-500 text-center">Keys are generated entirely in your browser and are not stored or transmitted.</p>
				</div>
			{/if}
		</div>
		
		<!-- Security Information Section -->
		<div class="mt-8 max-w-md mx-auto p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
			<h3 class="text-sm font-semibold text-slate-200 mb-2.5">Security Information</h3>
			<ul class="text-xs text-slate-400 space-y-1.5 leading-relaxed">
				<li>• Keys are generated using Web Crypto API's secure random generator</li>
				<li>• All generation happens locally in your browser</li>
				<li>• No keys are stored or transmitted to any server</li>
				<li>• For maximum security, generate new keys regularly</li>
			</ul>
		</div>
	</div>
</div>

<Footer />

<style>
	/* Styles for this page - custom-radio should now be global from app.css */
</style> 