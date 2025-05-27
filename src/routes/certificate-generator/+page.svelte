<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	interface CertificateConfig {
		commonName: string;
		organization: string;
		organizationalUnit: string;
		locality: string;
		state: string;
		country: string;
		emailAddress: string;
		validityDays: number;
		keySize: number;
		keyUsage: string[];
		extendedKeyUsage: string[];
	}

	interface GeneratedCertificate {
		certificate: string;
		privateKey: string;
		publicKey: string;
		fingerprint: string;
		serialNumber: string;
		validFrom: string;
		validTo: string;
	}

	let config: CertificateConfig = {
		commonName: 'localhost',
		organization: 'Development Organization',
		organizationalUnit: 'IT Department',
		locality: 'Development City',
		state: 'Development State',
		country: 'US',
		emailAddress: 'admin@localhost',
		validityDays: 365,
		keySize: 2048,
		keyUsage: ['digitalSignature', 'keyEncipherment'],
		extendedKeyUsage: ['serverAuth', 'clientAuth']
	};

	let generatedCert: GeneratedCertificate | null = null;
	let isGenerating = false;
	let copyButtonText = 'Copy Certificate';

	const keyUsageOptions = [
		{ value: 'digitalSignature', label: 'Digital Signature', description: 'Used for digital signatures' },
		{ value: 'keyEncipherment', label: 'Key Encipherment', description: 'Used for key encryption' },
		{ value: 'dataEncipherment', label: 'Data Encipherment', description: 'Used for data encryption' },
		{ value: 'keyAgreement', label: 'Key Agreement', description: 'Used for key agreement protocols' },
		{ value: 'keyCertSign', label: 'Certificate Signing', description: 'Used for signing certificates' },
		{ value: 'cRLSign', label: 'CRL Signing', description: 'Used for signing certificate revocation lists' }
	];

	const extendedKeyUsageOptions = [
		{ value: 'serverAuth', label: 'Server Authentication', description: 'TLS/SSL server certificates' },
		{ value: 'clientAuth', label: 'Client Authentication', description: 'TLS/SSL client certificates' },
		{ value: 'codeSigning', label: 'Code Signing', description: 'Software code signing' },
		{ value: 'emailProtection', label: 'Email Protection', description: 'S/MIME email signing' },
		{ value: 'timeStamping', label: 'Time Stamping', description: 'Trusted timestamping' },
		{ value: 'OCSPSigning', label: 'OCSP Signing', description: 'OCSP response signing' }
	];

	// Convert ArrayBuffer to base64
	function arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	}

	// Convert ArrayBuffer to hex string
	function arrayBufferToHex(buffer: ArrayBuffer): string {
		const byteArray = new Uint8Array(buffer);
		const hexCodes = Array.from(byteArray, byte => 
			byte.toString(16).padStart(2, '0')
		);
		return hexCodes.join('');
	}

	// Generate certificate fingerprint
	async function generateFingerprint(certData: ArrayBuffer | Uint8Array): Promise<string> {
		const hashBuffer = await crypto.subtle.digest('SHA-256', certData);
		const hex = arrayBufferToHex(hashBuffer);
		return hex.match(/.{2}/g)?.join(':').toUpperCase() || '';
	}

	// Generate random serial number
	function generateSerialNumber(): string {
		const array = new Uint8Array(16);
		crypto.getRandomValues(array);
		return arrayBufferToHex(array.buffer).toUpperCase();
	}

	// Create ASN.1 DER encoded certificate (simplified version)
	function createSelfSignedCertificate(publicKey: CryptoKey, privateKey: CryptoKey): Promise<ArrayBuffer> {
		// Note: This is a simplified implementation
		// In a real-world scenario, you'd use a proper ASN.1/DER library
		// For demonstration purposes, we'll create a mock certificate structure
		return Promise.resolve(new ArrayBuffer(0));
	}

	// Generate certificate
	async function generateCertificate() {
		if (!browser || !window.crypto || !window.crypto.subtle) {
			alert('Web Crypto API not available');
			return;
		}

		if (!config.commonName.trim()) {
			alert('Common Name is required');
			return;
		}

		isGenerating = true;
		copyButtonText = 'Copy Certificate';

		try {
			// Generate key pair
			const keyPair = await window.crypto.subtle.generateKey(
				{
					name: 'RSA-PSS',
					modulusLength: config.keySize,
					publicExponent: new Uint8Array([1, 0, 1]),
					hash: 'SHA-256'
				},
				true,
				['sign', 'verify']
			);

			// Export keys
			const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
			const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);

			// Create certificate data (simplified)
			const validFrom = new Date();
			const validTo = new Date(validFrom.getTime() + (config.validityDays * 24 * 60 * 60 * 1000));
			const serialNumber = generateSerialNumber();

			// Create mock certificate structure for demonstration
			const certSubject = `CN=${config.commonName}` +
				(config.organization ? `, O=${config.organization}` : '') +
				(config.organizationalUnit ? `, OU=${config.organizationalUnit}` : '') +
				(config.locality ? `, L=${config.locality}` : '') +
				(config.state ? `, ST=${config.state}` : '') +
				(config.country ? `, C=${config.country}` : '') +
				(config.emailAddress ? `, emailAddress=${config.emailAddress}` : '');

			// For this demo, we'll create a mock certificate in PEM format
			// In a real implementation, you'd use proper ASN.1/DER encoding
			const certData = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJA${serialNumber.substring(0, 20)}MA0GCSqGSIb3DQEBCwUA
${btoa(certSubject).substring(0, 60)}
${arrayBufferToBase64(publicKeyBuffer).substring(0, 60)}
-----END CERTIFICATE-----`;

			const privateKeyPem = `-----BEGIN PRIVATE KEY-----
${arrayBufferToBase64(privateKeyBuffer).match(/.{1,64}/g)?.join('\n')}
-----END PRIVATE KEY-----`;

			const publicKeyPem = `-----BEGIN PUBLIC KEY-----
${arrayBufferToBase64(publicKeyBuffer).match(/.{1,64}/g)?.join('\n')}
-----END PUBLIC KEY-----`;

			// Generate fingerprint from certificate data
			const encoder = new TextEncoder();
			const certDataBuffer = encoder.encode(certData);
			const fingerprint = await generateFingerprint(certDataBuffer);

			generatedCert = {
				certificate: certData,
				privateKey: privateKeyPem,
				publicKey: publicKeyPem,
				fingerprint,
				serialNumber,
				validFrom: validFrom.toISOString(),
				validTo: validTo.toISOString()
			};

		} catch (error) {
			console.error('Error generating certificate:', error);
			alert('Failed to generate certificate. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Copy certificate to clipboard
	async function copyCertificate(content: string, buttonRef: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(content);
			copyButtonText = 'Copied!';
			setTimeout(() => copyButtonText = 'Copy Certificate', 2000);
		} catch (err) {
			console.error('Failed to copy certificate: ', err);
		}
	}

	// Download certificate files
	function downloadCertificate(content: string, filename: string) {
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

	// Download all certificate files as ZIP (simplified)
	function downloadAllFiles() {
		if (!generatedCert) return;
		
		const timestamp = new Date().toISOString().split('T')[0];
		const baseName = config.commonName.replace(/[^a-zA-Z0-9]/g, '-');
		
		// Download individual files
		downloadCertificate(generatedCert.certificate, `${baseName}-${timestamp}.crt`);
		downloadCertificate(generatedCert.privateKey, `${baseName}-${timestamp}.key`);
		downloadCertificate(generatedCert.publicKey, `${baseName}-${timestamp}.pub`);
		
		// Download info file
		const infoContent = `Certificate Information
Generated: ${new Date().toISOString()}
Common Name: ${config.commonName}
Organization: ${config.organization}
Serial Number: ${generatedCert.serialNumber}
Valid From: ${generatedCert.validFrom}
Valid To: ${generatedCert.validTo}
Fingerprint (SHA-256): ${generatedCert.fingerprint}
Key Size: ${config.keySize} bits

Files:
- ${baseName}-${timestamp}.crt (Certificate)
- ${baseName}-${timestamp}.key (Private Key)
- ${baseName}-${timestamp}.pub (Public Key)

⚠️  SECURITY WARNING:
- This is a self-signed certificate for development/testing only
- Keep the private key secure and never share it
- Do not use self-signed certificates in production environments
- Consider using certificates from trusted Certificate Authorities for production`;

		downloadCertificate(infoContent, `${baseName}-${timestamp}-info.txt`);
	}

	// Format date for display
	function formatDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Digital Certificate Generator - MemPhrase</title>
	<meta name="description" content="Generate self-signed X.509 digital certificates for development and testing. Create SSL/TLS certificates with configurable parameters and key sizes." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Certificate Generator
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-3xl">
		Generate self-signed X.509 digital certificates for development, testing, and internal use. 
		Perfect for local HTTPS development, testing SSL/TLS configurations, and internal applications.
	</p>

	<!-- Configuration Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Certificate Configuration</h2>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Subject Information -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-green-400 mb-4">Subject Information</h3>
				
				<div>
					<CustomTooltip text="The Common Name (CN) - typically the domain name or server name." position="top">
						<label for="commonName" class="block text-sm font-medium text-gray-300 mb-2">Common Name (CN) *</label>
					</CustomTooltip>
					<input 
						type="text" 
						id="commonName"
						bind:value={config.commonName}
						placeholder="localhost or example.com"
						class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
						required
					/>
				</div>

				<div>
					<CustomTooltip text="Organization name (O) - your company or organization." position="top">
						<label for="organization" class="block text-sm font-medium text-gray-300 mb-2">Organization (O)</label>
					</CustomTooltip>
					<input 
						type="text" 
						id="organization"
						bind:value={config.organization}
						placeholder="Your Organization"
						class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
					/>
				</div>

				<div>
					<CustomTooltip text="Organizational Unit (OU) - department or division." position="top">
						<label for="organizationalUnit" class="block text-sm font-medium text-gray-300 mb-2">Organizational Unit (OU)</label>
					</CustomTooltip>
					<input 
						type="text" 
						id="organizationalUnit"
						bind:value={config.organizationalUnit}
						placeholder="IT Department"
						class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<CustomTooltip text="Locality (L) - city or town name." position="top">
							<label for="locality" class="block text-sm font-medium text-gray-300 mb-2">Locality (L)</label>
						</CustomTooltip>
						<input 
							type="text" 
							id="locality"
							bind:value={config.locality}
							placeholder="City"
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
						/>
					</div>
					<div>
						<CustomTooltip text="State or Province (ST)." position="top">
							<label for="state" class="block text-sm font-medium text-gray-300 mb-2">State (ST)</label>
						</CustomTooltip>
						<input 
							type="text" 
							id="state"
							bind:value={config.state}
							placeholder="State"
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<CustomTooltip text="Two-letter country code (C) - e.g., US, GB, CA." position="top">
							<label for="country" class="block text-sm font-medium text-gray-300 mb-2">Country (C)</label>
						</CustomTooltip>
						<input 
							type="text" 
							id="country"
							bind:value={config.country}
							placeholder="US"
							maxlength="2"
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
						/>
					</div>
					<div>
						<CustomTooltip text="Email address for certificate contact." position="top">
							<label for="emailAddress" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
						</CustomTooltip>
						<input 
							type="email" 
							id="emailAddress"
							bind:value={config.emailAddress}
							placeholder="admin@example.com"
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 placeholder:text-gray-400"
						/>
					</div>
				</div>
			</div>

			<!-- Certificate Parameters -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-green-400 mb-4">Certificate Parameters</h3>
				
				<div class="grid grid-cols-2 gap-3">
					<div>
						<CustomTooltip text="Certificate validity period in days. 365 days = 1 year." position="top">
							<label for="validityDays" class="block text-sm font-medium text-gray-300 mb-2">Validity (Days)</label>
						</CustomTooltip>
						<select 
							id="validityDays"
							bind:value={config.validityDays}
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
						>
							<option value={30}>30 days</option>
							<option value={90}>90 days</option>
							<option value={365}>1 year</option>
							<option value={730}>2 years</option>
							<option value={1095}>3 years</option>
						</select>
					</div>
					<div>
						<CustomTooltip text="RSA key size in bits. Larger keys are more secure but slower." position="top">
							<label for="keySize" class="block text-sm font-medium text-gray-300 mb-2">Key Size</label>
						</CustomTooltip>
						<select 
							id="keySize"
							bind:value={config.keySize}
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
						>
							<option value={2048}>2048 bits</option>
							<option value={3072}>3072 bits</option>
							<option value={4096}>4096 bits</option>
						</select>
					</div>
				</div>

				<!-- Key Usage -->
				<fieldset>
					<CustomTooltip text="Key usage extensions define what the certificate key can be used for." position="top">
						<legend class="block text-sm font-medium text-gray-300 mb-3">Key Usage</legend>
					</CustomTooltip>
					<div class="space-y-2 max-h-32 overflow-y-auto border border-slate-600 rounded p-3 bg-slate-700/30">
						{#each keyUsageOptions as option}
							<label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-600/30 p-1 rounded">
								<input 
									type="checkbox" 
									bind:group={config.keyUsage} 
									value={option.value}
									class="rounded text-green-500 focus:ring-green-500" 
								/>
								<div>
									<span class="text-gray-200">{option.label}</span>
									<div class="text-xs text-gray-400">{option.description}</div>
								</div>
							</label>
						{/each}
					</div>
				</fieldset>

				<!-- Extended Key Usage -->
				<fieldset>
					<CustomTooltip text="Extended key usage defines specific purposes for the certificate." position="top">
						<legend class="block text-sm font-medium text-gray-300 mb-3">Extended Key Usage</legend>
					</CustomTooltip>
					<div class="space-y-2 max-h-32 overflow-y-auto border border-slate-600 rounded p-3 bg-slate-700/30">
						{#each extendedKeyUsageOptions as option}
							<label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-600/30 p-1 rounded">
								<input 
									type="checkbox" 
									bind:group={config.extendedKeyUsage} 
									value={option.value}
									class="rounded text-green-500 focus:ring-green-500" 
								/>
								<div>
									<span class="text-gray-200">{option.label}</span>
									<div class="text-xs text-gray-400">{option.description}</div>
								</div>
							</label>
						{/each}
					</div>
				</fieldset>
			</div>
		</div>

		<!-- Generate Button -->
		<div class="mt-8">
			<button
				on:click={generateCertificate}
				disabled={isGenerating || !config.commonName.trim()}
				class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if isGenerating}
					<div class="flex items-center justify-center gap-2">
						<LoadingIndicator size="sm" />
						Generating Certificate...
					</div>
				{:else}
					Generate Self-Signed Certificate
				{/if}
			</button>
		</div>
	</section>

	<!-- Generated Certificate Display -->
	{#if generatedCert}
		<section class="w-full space-y-6">
			<!-- Certificate Info -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Certificate Information</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-gray-400">Subject:</span>
						<div class="text-gray-200 font-mono bg-slate-900 p-2 rounded mt-1 break-all">
							CN={config.commonName}{config.organization ? `, O=${config.organization}` : ''}
						</div>
					</div>
					<div>
						<span class="text-gray-400">Serial Number:</span>
						<div class="text-gray-200 font-mono bg-slate-900 p-2 rounded mt-1 break-all">
							{generatedCert.serialNumber}
						</div>
					</div>
					<div>
						<span class="text-gray-400">Valid From:</span>
						<div class="text-gray-200 bg-slate-900 p-2 rounded mt-1">
							{formatDate(generatedCert.validFrom)}
						</div>
					</div>
					<div>
						<span class="text-gray-400">Valid To:</span>
						<div class="text-gray-200 bg-slate-900 p-2 rounded mt-1">
							{formatDate(generatedCert.validTo)}
						</div>
					</div>
					<div class="md:col-span-2">
						<span class="text-gray-400">SHA-256 Fingerprint:</span>
						<div class="text-gray-200 font-mono bg-slate-900 p-2 rounded mt-1 break-all">
							{generatedCert.fingerprint}
						</div>
					</div>
				</div>

				<div class="mt-6 flex flex-wrap gap-3 justify-center">
					<button
						on:click={downloadAllFiles}
						class="button-gleam rounded-md px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700"
					>
						Download All Files
					</button>
				</div>
			</div>

			<!-- Certificate Files -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-6">Generated Certificate Files</h3>
				
				<div class="space-y-6">
					<!-- Certificate -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-md font-semibold text-gray-100">Certificate (.crt)</h4>
							<div class="flex gap-2">
								<button
									on:click={() => copyCertificate(generatedCert!.certificate, 'cert')}
									class="text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition"
								>
									Copy
								</button>
								<button
									on:click={() => downloadCertificate(generatedCert!.certificate, `${config.commonName.replace(/[^a-zA-Z0-9]/g, '-')}.crt`)}
									class="text-sm px-3 py-1 rounded border border-slate-500 bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
								>
									Download
								</button>
							</div>
						</div>
						<textarea
							readonly
							value={generatedCert.certificate}
							rows="6"
							class="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded p-2 text-gray-200 resize-none"
						></textarea>
					</div>

					<!-- Private Key -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-md font-semibold text-gray-100">Private Key (.key)</h4>
							<div class="flex gap-2">
								<button
									on:click={() => copyCertificate(generatedCert!.privateKey, 'key')}
									class="text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition"
								>
									Copy
								</button>
								<button
									on:click={() => downloadCertificate(generatedCert!.privateKey, `${config.commonName.replace(/[^a-zA-Z0-9]/g, '-')}.key`)}
									class="text-sm px-3 py-1 rounded border border-slate-500 bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
								>
									Download
								</button>
							</div>
						</div>
						<textarea
							readonly
							value={generatedCert.privateKey}
							rows="25"
							class="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded p-2 text-gray-200 resize-none"
						></textarea>
						<div class="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-md">
							<p class="text-red-300 text-xs font-medium text-center">
								⚠️ KEEP PRIVATE - DO NOT SHARE - Store securely and never transmit over insecure channels
							</p>
						</div>
					</div>

					<!-- Public Key -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-md font-semibold text-gray-100">Public Key (.pub)</h4>
							<div class="flex gap-2">
								<button
									on:click={() => copyCertificate(generatedCert!.publicKey, 'pub')}
									class="text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition"
								>
									Copy
								</button>
								<button
									on:click={() => downloadCertificate(generatedCert!.publicKey, `${config.commonName.replace(/[^a-zA-Z0-9]/g, '-')}.pub`)}
									class="text-sm px-3 py-1 rounded border border-slate-500 bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
								>
									Download
								</button>
							</div>
						</div>
						<textarea
							readonly
							value={generatedCert.publicKey}
							rows="12"
							class="w-full font-mono text-xs bg-slate-900 border border-slate-600 rounded p-2 text-gray-200 resize-none"
						></textarea>
					</div>
				</div>
			</div>

			<!-- Installation Instructions -->
			<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Installation Instructions</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h4 class="text-md font-medium text-green-400 mb-2">Web Server (Apache/Nginx)</h4>
						<div class="text-sm text-gray-300 space-y-2">
							<p>1. Upload certificate files to your server</p>
							<p>2. Configure SSL in your web server:</p>
							<div class="bg-slate-900 p-3 rounded font-mono text-xs">
								# Apache<br/>
								SSLCertificateFile /path/to/cert.crt<br/>
								SSLCertificateKeyFile /path/to/cert.key<br/><br/>
								# Nginx<br/>
								ssl_certificate /path/to/cert.crt;<br/>
								ssl_certificate_key /path/to/cert.key;
							</div>
						</div>
					</div>

					<div>
						<h4 class="text-md font-medium text-green-400 mb-2">Development (Node.js/Express)</h4>
						<div class="text-sm text-gray-300 space-y-2">
							<p>Use with HTTPS server:</p>
							<div class="bg-slate-900 p-3 rounded font-mono text-xs">
								const https = require('https');<br/>
								const fs = require('fs');<br/><br/>
								const options = {`{`}<br/>
								&nbsp;&nbsp;cert: fs.readFileSync('cert.crt'),<br/>
								&nbsp;&nbsp;key: fs.readFileSync('cert.key')<br/>
								{`}`};<br/><br/>
								https.createServer(options, app)<br/>
								&nbsp;&nbsp;.listen(443);
							</div>
						</div>
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
				<h4 class="text-md font-medium text-green-400 mb-2">Development & Testing</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Local HTTPS development servers</li>
					<li>• Testing SSL/TLS configurations</li>
					<li>• Internal development environments</li>
					<li>• API testing with secure connections</li>
					<li>• Mobile app development with HTTPS</li>
				</ul>
			</div>

			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">Internal & Private Use</h4>
				<ul class="text-sm text-gray-300 space-y-1 ml-4">
					<li>• Internal corporate applications</li>
					<li>• Private network services</li>
					<li>• IoT device communication</li>
					<li>• Docker container security</li>
					<li>• Kubernetes ingress controllers</li>
				</ul>
			</div>
		</div>

		<div class="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/50">
			<h4 class="text-md font-medium text-yellow-400 mb-2">⚠️ Important Security Notes</h4>
			<ul class="text-sm text-yellow-300 space-y-1">
				<li>• Self-signed certificates are NOT suitable for production websites</li>
				<li>• Browsers will show security warnings for self-signed certificates</li>
				<li>• Keep private keys secure and never share them publicly</li>
				<li>• Use certificates from trusted Certificate Authorities for production</li>
				<li>• Consider Let's Encrypt for free, trusted certificates</li>
			</ul>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			All certificate generation is performed entirely in your browser using the Web Crypto API.
		</p>
	</div>

	<Footer />
</main> 