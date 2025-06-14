<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	interface TOTPSecret {
		secret: string;
		qrCodeUrl: string;
		manualEntryKey: string;
		otpAuthUrl: string;
	}

	let accountName = '';
	let issuer = 'MemPhrase';
	let secretLength = 32; // RFC 6238 recommends 160 bits minimum (20 bytes), we use 32 for extra security
	let generatedSecret: TOTPSecret | null = null;
	let copyButtonText = 'Copy Secret';
	let copyUrlButtonText = 'Copy URL';
	let isGenerating = false;
	let qrCodeDataUrl = '';

	// Base32 alphabet (RFC 4648)
	const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

	// Generate a secure random secret and encode it in Base32
	function generateBase32Secret(length: number): string {
		if (!browser || !window.crypto) {
			throw new Error('Secure random number generator not available');
		}

		const randomBytes = new Uint8Array(length);
		window.crypto.getRandomValues(randomBytes);

		// Convert to Base32
		let result = '';
		for (let i = 0; i < randomBytes.length; i++) {
			result += BASE32_ALPHABET[randomBytes[i] % 32];
		}
		return result;
	}

	// Generate QR code using a public API (qr-server.com)
	async function generateQRCode(data: string): Promise<string> {
		const size = 200;
		const encodedData = encodeURIComponent(data);
		const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&bgcolor=1e293b&color=ffffff&format=png&ecc=M`;
		return qrUrl;
	}

	// Format secret for manual entry (groups of 4 characters)
	function formatSecretForManualEntry(secret: string): string {
		return secret.match(/.{1,4}/g)?.join(' ') || secret;
	}

	async function generateTOTPSecret() {
		if (!accountName.trim()) {
			alert('Please enter an account name');
			return;
		}

		isGenerating = true;
		copyButtonText = 'Copy Secret';
		copyUrlButtonText = 'Copy URL';

		try {
			// Generate secure random secret
			const secret = generateBase32Secret(secretLength);
			
			// Create OTP Auth URL (used by authenticator apps)
			const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
			
			// Generate QR code
			const qrCodeUrl = await generateQRCode(otpAuthUrl);
			
			generatedSecret = {
				secret,
				qrCodeUrl,
				manualEntryKey: formatSecretForManualEntry(secret),
				otpAuthUrl
			};

		} catch (error) {
			console.error('Error generating TOTP secret:', error);
			alert('Failed to generate TOTP secret. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	async function copyToClipboard(text: string, type: 'secret' | 'url') {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			if (type === 'secret') {
				copyButtonText = 'Copied!';
				setTimeout(() => copyButtonText = 'Copy Secret', 2000);
			} else {
				copyUrlButtonText = 'Copied!';
				setTimeout(() => copyUrlButtonText = 'Copy URL', 2000);
			}
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}

	// Generate initial secret on mount
	onMount(() => {
		if (browser) {
			accountName = 'user@example.com';
		}
	});
</script>

<svelte:head>
	<title>TOTP Secret Generator - MemPhrase</title>
	<meta name="description" content="Generate secure TOTP secrets for 2FA authentication apps like Google Authenticator, Authy, and Microsoft Authenticator. Free, secure, and runs entirely in your browser." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			TOTP Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-2xl">
		Generate secure Time-based One-Time Password (TOTP) secrets for 2FA authentication. 
		Compatible with Google Authenticator, Authy, Microsoft Authenticator, and other TOTP apps.
	</p>

	<!-- Configuration Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">TOTP Configuration</h2>
		
		<div class="space-y-6">
			<!-- Account Name -->
			<div>
				<CustomTooltip text="The account identifier (usually email or username) that will appear in your authenticator app." position="top">
					<label for="accountName" class="block text-sm font-medium text-gray-300 mb-2">Account Name *</label>
				</CustomTooltip>
				<input 
					type="text" 
					id="accountName" 
					bind:value={accountName}
					placeholder="user@example.com"
					class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
					required
				/>
			</div>

			<!-- Issuer -->
			<div>
				<CustomTooltip text="The service or organization name that will appear in your authenticator app." position="top">
					<label for="issuer" class="block text-sm font-medium text-gray-300 mb-2">Issuer/Service Name</label>
				</CustomTooltip>
				<input 
					type="text" 
					id="issuer" 
					bind:value={issuer}
					placeholder="My App"
					class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
				/>
			</div>

			<!-- Secret Length -->
			<div>
				<CustomTooltip text="Length of the secret key. 32 characters (256 bits) provides excellent security." position="top">
					<label for="secretLength" class="block text-sm font-medium text-gray-300 mb-2">Secret Length: <span class="font-bold text-green-400">{secretLength} characters</span></label>
				</CustomTooltip>
				<div class="flex items-center gap-4">
					<input 
						type="range" 
						id="secretLength" 
						min="16" 
						max="64" 
						step="8"
						bind:value={secretLength}
						class="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
					/>
					<div class="text-xs text-gray-400 min-w-[80px]">
						{Math.floor(secretLength * 5 / 8)} bytes
					</div>
				</div>
			</div>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateTOTPSecret}
				disabled={isGenerating || !accountName.trim()}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating TOTP Secret...
					</div>
				{:else}
					Generate TOTP Secret
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated Secret Display -->
	{#if generatedSecret}
		<section class="w-full space-y-6">
			<!-- QR Code -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4 text-center">QR Code Setup</h3>
				
				<div class="flex flex-col items-center space-y-4">
					<div class="bg-white p-4 rounded-lg">
						<img 
							src={generatedSecret.qrCodeUrl} 
							alt="TOTP QR Code" 
							class="w-48 h-48"
							loading="lazy"
						/>
					</div>
					
					<div class="text-center space-y-2">
						<p class="text-sm text-gray-300 font-medium">Scan with your authenticator app:</p>
						<ul class="text-xs text-gray-400 space-y-1">
							<li>• Google Authenticator</li>
							<li>• Microsoft Authenticator</li>
							<li>• Authy</li>
							<li>• 1Password</li>
							<li>• Any TOTP-compatible app</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Manual Entry -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold text-gray-100">Manual Entry</h3>
					<button
						on:click={() => copyToClipboard(generatedSecret!.secret, 'secret')}
						class="button-gleam min-w-[100px] rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Copied') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
					>
						{copyButtonText}
					</button>
				</div>
				
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-300 mb-2">Secret Key (Base32):</label>
						<div class="bg-slate-900 rounded-md p-4 border border-slate-600">
							<code class="text-sm text-gray-300 font-mono break-all">{generatedSecret.manualEntryKey}</code>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span class="text-gray-400">Algorithm:</span>
							<span class="text-gray-200 ml-2">SHA1</span>
						</div>
						<div>
							<span class="text-gray-400">Digits:</span>
							<span class="text-gray-200 ml-2">6</span>
						</div>
						<div>
							<span class="text-gray-400">Period:</span>
							<span class="text-gray-200 ml-2">30 seconds</span>
						</div>
						<div>
							<span class="text-gray-400">Issuer:</span>
							<span class="text-gray-200 ml-2">{issuer}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- OTP Auth URL -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold text-gray-100">OTP Auth URL</h3>
					<button
						on:click={() => copyToClipboard(generatedSecret!.otpAuthUrl, 'url')}
						class="button-gleam min-w-[90px] rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60 dark:focus:ring-offset-slate-700 {copyUrlButtonText.includes('Copied') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
					>
						{copyUrlButtonText}
					</button>
				</div>
				
				<div class="bg-slate-900 rounded-md p-4 border border-slate-600 mb-4">
					<code class="text-xs text-gray-300 font-mono break-all">{generatedSecret.otpAuthUrl}</code>
				</div>
				
				<p class="text-xs text-gray-400">
					This URL can be imported directly into compatible authenticator apps or used to generate QR codes.
				</p>
			</div>

			<!-- Security Information -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Security Information</h3>
				
				<div class="space-y-3 text-sm">
					<div class="p-3 bg-green-900/20 border border-green-500/50 rounded-md">
						<p class="text-green-300">
							<strong>✅ Secure:</strong> Secret generated using cryptographically secure random number generator
						</p>
					</div>
					
					<div class="p-3 bg-blue-900/20 border border-blue-500/50 rounded-md">
						<p class="text-blue-300">
							<strong>🔒 Private:</strong> Generated entirely in your browser - no data transmitted to servers
						</p>
					</div>
					
					<div class="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-md">
						<p class="text-yellow-300">
							<strong>⚠️ Important:</strong> Save this secret securely! You'll need it to recover your 2FA if you lose your device
						</p>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Instructions -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Setup Instructions</h3>
		
		<div class="space-y-6">
			<!-- Method 1: QR Code -->
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Method 1: QR Code (Recommended)</h4>
				<ol class="text-sm text-gray-300 space-y-2 ml-4">
					<li class="list-decimal">Open your authenticator app</li>
					<li class="list-decimal">Look for "Add account", "Scan QR code", or "+" button</li>
					<li class="list-decimal">Scan the QR code displayed above</li>
					<li class="list-decimal">Verify the account appears in your app with the correct name</li>
				</ol>
			</div>

			<!-- Method 2: Manual Entry -->
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Method 2: Manual Entry</h4>
				<ol class="text-sm text-gray-300 space-y-2 ml-4">
					<li class="list-decimal">Open your authenticator app</li>
					<li class="list-decimal">Look for "Add account manually" or "Enter setup key"</li>
					<li class="list-decimal">Enter the account name: <code class="bg-slate-700 px-1 rounded text-xs">{accountName || 'your-account'}</code></li>
					<li class="list-decimal">Enter the secret key from the "Manual Entry" section above</li>
					<li class="list-decimal">Ensure settings match: SHA1, 6 digits, 30 seconds</li>
				</ol>
			</div>

			<!-- Verification -->
			<div class="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
				<h4 class="text-md font-medium text-blue-400 mb-2">Verification</h4>
				<p class="text-sm text-gray-300">
					After setup, your authenticator app will display a 6-digit code that changes every 30 seconds. 
					Test this code with your service to ensure 2FA is working correctly.
				</p>
			</div>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			TOTP secrets are generated entirely in your browser and are not stored or transmitted.
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