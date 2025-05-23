<script lang="ts">
	// No specific Svelte lifecycle functions needed for this static-like page yet.
	// currentYear is already on the main page, not directly needed here unless repeating copyright.

	interface CryptoCurrency {
		name: string;
		symbol: string;
		address: string;
		qrImagePath: string; // Path to the QR code image
	}

	const cryptocurrencies: CryptoCurrency[] = [
		{ name: 'Bitcoin', symbol: 'BTC', address: 'bc1qt7nup0f8fuu54pwv5u2ngpy85pdhxly9wat2r0', qrImagePath: '/qr-code-btc.png' },
		{ name: 'Ethereum', symbol: 'ETH', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-eth.png' },
		{ name: 'BNB (SmartChain)', symbol: 'BNB', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-bnb.png' },
		{ name: 'USDC (Polygon)', symbol: 'USDC', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-usdc-polygon.png' },
		{ name: 'USDT (Tron)', symbol: 'USDT', address: 'TAWPxf48E4gypFcfCHP7gqFaJFsztXQSEC', qrImagePath: '/qr-code-usdt-tron.png' },
		{ name: 'MATIC (Polygon)', symbol: 'MATIC', address: '0x56290e28f2054Ab81d672f2Ac8Cf98C56a9aBab6', qrImagePath: '/qr-code-matic.png' },
		{ name: 'Litecoin', symbol: 'LTC', address: 'ltc1q4gms5ghpdxz07a544w35cere53k30qxamrjhsu', qrImagePath: '/qr-code-ltc.png' },
		{ name: 'Dogecoin', symbol: 'DOGE', address: 'D5RuDLZB4MBZaLkMdS4QTZCrFPN2FbHG9K', qrImagePath: '/qr-code-doge.png' },
		{ name: 'Monero', symbol: 'XMR', address: '4AXmDVDpdGCQE8YVG9FTAN8MgHxbur6SxbmtgeCKESZaDGdxsYm1rkT3QyUpcYHypNRiPLWYjJpL9TUxXi9kp7oL2j5W1kS', qrImagePath: '/qr-code-xmr.png' },
		{ name: 'Polkadot', symbol: 'DOT', address: '12utevfZWm1vkZpEZPpDod3mJffRMWZP8FT4FTDt1X2HXg8A', qrImagePath: '/qr-code-dot.png' }
	];

	let selectedCrypto: CryptoCurrency | undefined = cryptocurrencies[0]; // Default to the first one
	let copyButtonText = "Copy";

	function handleCryptoChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedCrypto = cryptocurrencies.find(c => c.symbol === target.value);
		copyButtonText = "Copy"; // Reset copy button text
	}

	async function copyCryptoAddress() {
		if (!selectedCrypto || !navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(selectedCrypto.address);
			copyButtonText = "Copied!";
			setTimeout(() => (copyButtonText = "Copy"), 2000);
		} catch (err) {
			console.error('Failed to copy address: ', err);
			copyButtonText = "Error";
			setTimeout(() => (copyButtonText = "Copy"), 2000);
		}
	}

</script>

<svelte:head>
	<title>Support MemPhrase - Donate</title>
	<meta name="description" content="Support the development of MemPhrase by making a donation." />
</svelte:head>

<div class="container mx-auto max-w-2xl p-4 md:p-6 text-slate-200 ">
	<div class="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6 md:p-8">
		<div class="prose prose-invert prose-sm md:prose-base max-w-none text-center">
			<h1 class="text-3xl font-bold text-slate-100 mb-6">Support MemPhrase</h1>

			<p class="text-lg text-slate-300 mb-8">
				If you find MemPhrase useful, please consider supporting its ongoing development. Your contributions help keep the project alive, ad-free, and improving!
			</p>

			<div class="space-y-4 mt-8 mb-0">
				<p class="text-slate-300">You can support us through the following platforms:</p>
				
				<a href="https://ko-fi.com/memphrase" target="_blank" rel="noopener noreferrer" 
				class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 text-base no-underline button-gleam">
					Buy Me a Coffee on Ko-fi
				</a>

				<div class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 text-base no-underline button-gleam ml-4"
				hidden>
					Become a Patron (Example)
				</div>
			</div>

			<p class="text-slate-300 mb-4">
				Or contribute via Cryptocurrency:
			</p>
			
			<div class="max-w-sm mx-auto mb-6">
				<label for="crypto-select" class="block text-sm font-medium text-slate-300 mb-1">Select Cryptocurrency:</label>
				<select id="crypto-select" on:change={handleCryptoChange} class="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5">
					{#each cryptocurrencies as crypto (crypto.symbol)}
						<option value={crypto.symbol}>{crypto.name} ({crypto.symbol})</option>
					{/each}
				</select>
			</div>

			{#if selectedCrypto}
				<div class="mt-6 mb-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg flex flex-col items-center">
					<h3 class="text-xl font-semibold text-slate-100 mb-3">{selectedCrypto.name} ({selectedCrypto.symbol})</h3>
					<div class="w-72 h-72 bg-white p-2 rounded-md flex items-center justify-center mb-4">
						<!-- IMPORTANT: Replace with your actual QR code images -->
						<img src={selectedCrypto.qrImagePath} alt="{selectedCrypto.name} QR Code" class="max-w-full max-h-full object-contain" loading="lazy" />
					</div>
					<p class="text-sm text-slate-400 mb-1">Address:</p>
					<div class="flex items-center justify-between w-full max-w-lg bg-slate-700 p-2 rounded-md mb-3">
						<span class="font-mono text-sm text-slate-200 break-all mr-2">{selectedCrypto.address}</span>
						<button on:click={copyCryptoAddress} title="Copy Address" class="p-1.5 rounded-md {copyButtonText === 'Copied!' ? 'bg-emerald-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors text-xs min-w-[50px]">
							{copyButtonText}
						</button>
					</div>
					<p class="text-xs text-slate-500">(Please ensure you are sending the correct cryptocurrency to this address.)</p>
				</div>
			{/if}

			<p class="text-slate-300 mt-10">
				Thank you for your support!
			</p>
		</div>
		<div class="mt-12 text-center">
			<a href="/" class="text-green-400 hover:text-green-300 transition-colors">&#8592; Back to MemPhrase</a>
		</div>
	</div>
</div>

<style>
	/* Basic styling for prose content if not using Tailwind Typography plugin */
	.prose h1 {
		margin-bottom: 0.5em;
	}
	.prose p {
		margin-bottom: 1em;
		line-height: 1.6;
	}
	.prose a.button-gleam:hover {
		text-decoration: none;
	}
</style> 