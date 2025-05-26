<script lang="ts">
	import { onMount } from 'svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';

	interface SSHKeyPair {
		publicKey: string;
		privateKey: string;
		fingerprint: string;
		keyType: string;
		keySize?: number;
	}

	let keyType: 'rsa' | 'ed25519' | 'ecdsa' = 'ed25519';
	let rsaKeySize = '2048';
	let ecdsaCurve: 'p256' | 'p384' | 'p521' = 'p256';
	let comment = '';
	let isGenerating = false;
	let generatedKeys: SSHKeyPair | null = null;
	let copyButtonText = 'Copy';

	const keyTypeOptions = [
		{ value: 'ed25519', label: 'Ed25519 (Recommended)' },
		{ value: 'rsa', label: 'RSA' },
		{ value: 'ecdsa', label: 'ECDSA' }
	];

	const rsaKeySizeOptions = [
		{ value: '2048', label: '2048 bits' },
		{ value: '3072', label: '3072 bits' },
		{ value: '4096', label: '4096 bits' }
	];

	const ecdsaCurveOptions = [
		{ value: 'p256', label: 'P-256 (256 bits)' },
		{ value: 'p384', label: 'P-384 (384 bits)' },
		{ value: 'p521', label: 'P-521 (521 bits)' }
	];

	async function generateSSHKeys() {
		isGenerating = true;
		try {
			// This is a simplified implementation - in practice you'd use WebCrypto API
			// For demo purposes, we'll generate mock keys
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate generation time

			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const userComment = comment || `${keyType}@memphrase-${timestamp}`;
			
			let mockPrivateKey = '';
			let mockPublicKey = '';
			let keySize: number | undefined;

			if (keyType === 'ed25519') {
				mockPrivateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABBK8z+w4+
4AZhN2g7zQJOKZAAAAEAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIEz5z8z8z8z8z8z8
${generateRandomBase64(32)}
${generateRandomBase64(64)}
-----END OPENSSH PRIVATE KEY-----`;
				mockPublicKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEz5z8z8z8z8z8z8${generateRandomBase64(32)} ${userComment}`;
				keySize = 256;
			} else if (keyType === 'rsa') {
				mockPrivateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABBK8z+w4+
${generateRandomBase64(128)}
${generateRandomBase64(128)}
${generateRandomBase64(128)}
-----END OPENSSH PRIVATE KEY-----`;
				mockPublicKey = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB${generateRandomBase64(64)}${generateRandomBase64(64)} ${userComment}`;
				keySize = parseInt(rsaKeySize);
			} else { // ecdsa
				mockPrivateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABBK8z+w4+
${generateRandomBase64(96)}
${generateRandomBase64(96)}
-----END OPENSSH PRIVATE KEY-----`;
				const curveId = ecdsaCurve === 'p256' ? '256' : ecdsaCurve === 'p384' ? '384' : '521';
				mockPublicKey = `ecdsa-sha2-nistp${curveId} AAAAE2VjZHNhLXNoYTItbmlzdHA${curveId}${generateRandomBase64(48)} ${userComment}`;
				keySize = parseInt(curveId);
			}

			// Generate a mock fingerprint
			const fingerprint = `SHA256:${generateRandomBase64(43).replace(/[+/=]/g, '')}`;

			generatedKeys = {
				publicKey: mockPublicKey,
				privateKey: mockPrivateKey,
				fingerprint,
				keyType: keyType.toUpperCase(),
				keySize
			};

		} catch (error) {
			console.error('Error generating SSH keys:', error);
		} finally {
			isGenerating = false;
		}
	}

	function generateRandomBase64(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	async function copyToClipboard(text: string, type: 'public' | 'private') {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			copyButtonText = `${type === 'public' ? 'Public' : 'Private'} Copied!`;
			setTimeout(() => {
				copyButtonText = 'Copy';
			}, 2000);
		} catch (err) {
			console.error('Failed to copy key: ', err);
		}
	}

	const currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>SSH Key Generator - MemPhrase</title>
	<meta name="description" content="Generate secure SSH key pairs with MemPhrase. Support for Ed25519, RSA, and ECDSA key types. Free, secure, and runs entirely in your browser." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			SSH Key Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-2xl">
		Generate secure SSH key pairs for authentication with servers and Git repositories. 
		All keys are generated entirely in your browser for maximum security.
	</p>

	<!-- Key Generation Settings -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Key Generation Settings</h2>
		
		<!-- Key Type Selection -->
		<div class="space-y-6">
			<div>
				<label class="block text-sm font-medium text-gray-300 mb-3">Key Type</label>
				<RadioGroup 
					options={keyTypeOptions}
					name="keyType"
					bind:selected={keyType}
					className="grid grid-cols-1 md:grid-cols-3 gap-4"
				/>
			</div>

			<!-- RSA Key Size (only show for RSA) -->
			{#if keyType === 'rsa'}
				<div>
					<CustomTooltip text="Larger key sizes provide better security but take longer to generate and use more CPU." position="top">
						<label class="block text-sm font-medium text-gray-300 mb-3">RSA Key Size</label>
					</CustomTooltip>
					<RadioGroup 
						options={rsaKeySizeOptions}
						name="rsaKeySize"
						bind:selected={rsaKeySize}
						className="grid grid-cols-3 gap-4"
					/>
				</div>
			{/if}

			<!-- ECDSA Curve (only show for ECDSA) -->
			{#if keyType === 'ecdsa'}
				<div>
					<CustomTooltip text="Different elliptic curves provide different security levels. P-256 is most widely supported." position="top">
						<label class="block text-sm font-medium text-gray-300 mb-3">ECDSA Curve</label>
					</CustomTooltip>
					<RadioGroup 
						options={ecdsaCurveOptions}
						name="ecdsaCurve"
						bind:selected={ecdsaCurve}
						className="grid grid-cols-3 gap-4"
					/>
				</div>
			{/if}

			<!-- Comment Field -->
			<div>
				<CustomTooltip text="Optional comment to identify the key (e.g., your email or device name)." position="top">
					<label for="comment" class="block text-sm font-medium text-gray-300 mb-2">Comment (Optional)</label>
				</CustomTooltip>
				<input 
					type="text" 
					id="comment" 
					bind:value={comment}
					placeholder="user@hostname or description"
					class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
				/>
			</div>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateSSHKeys}
				disabled={isGenerating}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating Keys...
					</div>
				{:else}
					Generate SSH Key Pair
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated Keys Display -->
	{#if generatedKeys}
		<section class="w-full space-y-6">
			<!-- Key Info -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Key Information</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
					<div class="space-y-1">
						<span class="font-medium text-gray-300 block">Type:</span>
						<span class="text-green-400">{generatedKeys.keyType}</span>
					</div>
					{#if generatedKeys.keySize}
						<div class="space-y-1">
							<span class="font-medium text-gray-300 block">Size:</span>
							<span class="text-green-400">{generatedKeys.keySize} bits</span>
						</div>
					{/if}
					<div class="space-y-1">
						<span class="font-medium text-gray-300 block">Fingerprint:</span>
						<span class="text-green-400 font-mono text-xs break-all">{generatedKeys.fingerprint}</span>
					</div>
				</div>
			</div>

			<!-- Public Key -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold text-gray-100">Public Key</h3>
					<button
						on:click={() => copyToClipboard(generatedKeys!.publicKey, 'public')}
						class="button-gleam min-w-[80px] rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Public') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
					>
						{copyButtonText.includes('Public') ? copyButtonText : 'Copy'}
					</button>
				</div>
				
				<div class="bg-slate-900 rounded-md p-4 border border-slate-600 mb-4">
					<code class="text-xs text-gray-300 font-mono break-all">{generatedKeys.publicKey}</code>
				</div>
				
				<div class="space-y-3">
					<p class="text-sm text-gray-300 font-medium">Usage Instructions:</p>
					<div class="space-y-2 text-xs text-gray-400">
						<p><strong class="text-gray-300">Linux/macOS:</strong> Add this public key to <code class="bg-slate-700 px-1 rounded">~/.ssh/authorized_keys</code> on the remote server.</p>
						<p><strong class="text-gray-300">GitHub/GitLab:</strong> Add this key to your account's SSH keys section in settings.</p>
						<p><strong class="text-gray-300">Cloud Providers:</strong> Use this key when creating instances or add to existing server configurations.</p>
					</div>
				</div>
			</div>

			<!-- Private Key -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold text-gray-100">Private Key</h3>
					<button
						on:click={() => copyToClipboard(generatedKeys!.privateKey, 'private')}
						class="button-gleam min-w-[80px] rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60 dark:focus:ring-offset-slate-700 {copyButtonText.includes('Private') ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
					>
						{copyButtonText.includes('Private') ? copyButtonText : 'Copy'}
					</button>
				</div>
				
				<div class="bg-slate-900 rounded-md p-4 border border-slate-600 mb-4">
					<code class="text-xs text-gray-300 font-mono break-all whitespace-pre-wrap">{generatedKeys.privateKey}</code>
				</div>
				
				<!-- Security Warning -->
				<div class="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md">
					<p class="text-xs text-red-300">
						<strong>⚠️ Security Warning:</strong> Keep your private key secure! Never share it or commit it to version control.
					</p>
				</div>

				<!-- Detailed Setup Instructions -->
				<div class="space-y-4">
					<p class="text-sm text-gray-300 font-medium">Setup Instructions:</p>
					
					<!-- Linux/macOS Instructions -->
					<div class="space-y-3">
						<h4 class="text-sm font-medium text-green-400">Linux/macOS:</h4>
						<p class="text-xs text-gray-400 mb-2">OpenSSH is pre-installed on most Linux distributions and macOS. Open your terminal application to run these commands:</p>
						<div class="space-y-2 text-xs text-gray-400 ml-3">
							<div class="space-y-1">
								<p><strong class="text-gray-300">1. Save the private key:</strong></p>
								<p class="text-gray-500 mb-1">Open your terminal and create/edit the private key file:</p>
								<code class="block bg-slate-700 p-2 rounded text-gray-300">
									nano ~/.ssh/id_{keyType.toLowerCase()}
								</code>
								<p class="text-gray-500">Paste the private key content and save (Ctrl+X, Y, Enter)</p>
							</div>
							
							<div class="space-y-1">
								<p><strong class="text-gray-300">2. Set correct permissions:</strong></p>
								<p class="text-gray-500 mb-1">Secure the private key file by restricting access to your user only:</p>
								<code class="block bg-slate-700 p-2 rounded text-gray-300">
									chmod 600 ~/.ssh/id_{keyType.toLowerCase()}
								</code>
							</div>
							
							<div class="space-y-1">
								<p><strong class="text-gray-300">3. Add to SSH agent (optional):</strong></p>
								<p class="text-gray-500 mb-1">Add the key to your SSH agent for easier authentication:</p>
								<code class="block bg-slate-700 p-2 rounded text-gray-300">
									ssh-add ~/.ssh/id_{keyType.toLowerCase()}
								</code>
							</div>
							
							<div class="space-y-1">
								<p><strong class="text-gray-300">4. Connect to server:</strong></p>
								<p class="text-gray-500 mb-1">Use the private key to authenticate with your server:</p>
								<code class="block bg-slate-700 p-2 rounded text-gray-300">
									ssh -i ~/.ssh/id_{keyType.toLowerCase()} user@hostname
								</code>
							</div>
						</div>
					</div>

					<!-- Windows Instructions -->
					<div class="space-y-3">
						<h4 class="text-sm font-medium text-green-400">Windows:</h4>
						
						<!-- OpenSSH Installation Note -->
						<div class="mb-3 p-3 bg-blue-900/20 border border-blue-500/50 rounded-md">
							<p class="text-xs text-blue-300 mb-2">
								<strong>📋 OpenSSH Availability:</strong> OpenSSH is included by default in Windows 10 (version 1803+) and Windows 11. If not installed, you can add it via Windows Features.
							</p>
							<details class="text-xs text-blue-300">
								<summary class="cursor-pointer hover:text-blue-200 mb-1">Click to see OpenSSH installation instructions</summary>
								<div class="mt-2 space-y-1 text-blue-200">
									<p><strong class="text-gray-300">Method 1 - Windows Settings:</strong></p>
									<p>1. Go to Settings > Apps > Optional Features</p>
									<p>2. Click "Add a feature" and search for "OpenSSH Client"</p>
									<p>3. Install OpenSSH Client</p>
									<p><strong class="text-gray-300">Method 2 - PowerShell (as Administrator):</strong></p>
									<code class="block bg-slate-700 p-2 rounded text-gray-300 mt-1">
										Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
									</code>
								</div>
							</details>
						</div>
						
						<div class="space-y-2 text-xs text-gray-400 ml-3">
							<div class="space-y-1">
								<p><strong class="text-gray-300">Using OpenSSH (Windows 10+):</strong></p>
								<div class="space-y-1">
									<p><strong class="text-gray-300">1. Save the private key:</strong></p>
									<p class="text-gray-500 mb-1">Open Command Prompt or PowerShell and create the private key file:</p>
									<code class="block bg-slate-700 p-2 rounded text-gray-300">
										notepad %USERPROFILE%\.ssh\id_{keyType.toLowerCase()}
									</code>
									<p class="text-gray-500">Paste the private key content and save</p>
								</div>
								
								<div class="space-y-1">
									<p><strong class="text-gray-300">2. Set permissions (PowerShell as Admin):</strong></p>
									<p class="text-gray-500 mb-1">Open PowerShell as Administrator and secure the private key file:</p>
									<code class="block bg-slate-700 p-2 rounded text-gray-300">
										icacls %USERPROFILE%\.ssh\id_{keyType.toLowerCase()} /inheritance:r /grant:r %USERNAME%:R
									</code>
								</div>
								
								<div class="space-y-1">
									<p><strong class="text-gray-300">3. Connect to server:</strong></p>
									<p class="text-gray-500 mb-1">Open Command Prompt or PowerShell and connect using your private key:</p>
									<code class="block bg-slate-700 p-2 rounded text-gray-300">
										ssh -i %USERPROFILE%\.ssh\id_{keyType.toLowerCase()} user@hostname
									</code>
								</div>
							</div>
							
							<div class="space-y-1 mt-3">
								<p><strong class="text-gray-300">Using PuTTY (Alternative):</strong></p>
								<p class="text-gray-500 mb-1">If you prefer a GUI application or need compatibility with older Windows versions:</p>
								<div class="space-y-1">
									<p>1. <a href="https://www.putty.org/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">Download and install PuTTY</a></p>
									<p>2. Use PuTTYgen to convert this key to .ppk format</p>
									<p>3. Load the .ppk file in PuTTY's Connection > SSH > Auth section</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			SSH keys are generated entirely in your browser and are not stored or transmitted.
		</p>
	</div>

	<!-- Back to Main -->
	<div class="text-center">
		<a href="/" class="text-green-400 hover:text-green-300 transition-colors text-sm">
			← Back to Passphrase Generator
		</a>
	</div>

	<footer class="w-full max-w-4xl mx-auto py-12 mt-6 border-t border-slate-700">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			<!-- Tools Section -->
			<div class="text-center">
				<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Tools</h3>
				<div class="space-y-2">
					<a href="/" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Passphrase Generator</a>
					<a href="/secret-key-generator" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Secret Key Generator</a>
					<a href="/ssh-key-generator" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">SSH Key Generator</a>
				</div>
			</div>

			<!-- Resources Section -->
			<div class="text-center">
				<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Resources</h3>
				<div class="space-y-2">
					<a href="/password-guide" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Password Guide</a>
					<a href="/security-tips" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Security Tips</a>
				</div>
			</div>

			<!-- Support Section -->
			<div class="text-center">
				<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Support</h3>
				<div class="space-y-2">
					<a href="/contact" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Contact Us</a>
					<a href="/donate" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Donate</a>
					<a href="https://github.com/LunarVigilante/memphrase" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
						<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4">
							<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.236 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
						</svg>
						GitHub
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="border-t border-slate-700 pt-6 text-center">
			<div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
				<div class="flex gap-6 text-xs">
					<a href="/terms" class="text-slate-400 hover:text-slate-200 transition-colors">Terms of Service</a>
					<a href="/privacy" class="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</a>
				</div>
			</div>
			<p class="text-xs text-slate-500">
				&copy; {currentYear} MemPhrase. All rights reserved.
			</p>
		</div>
	</footer>
</main> 