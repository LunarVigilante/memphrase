<script lang="ts" context="module">
	import { browser } from '$app/environment';
	import { calculatePassphraseStrength } from '$lib/passwordUtils';

	// Define constants needed by the module
	const STORAGE_KEY = 'memphrase-password-history';
	const MAX_HISTORY_SIZE = 20;

	// Define the HistoryEntry interface for use in the module
	interface HistoryEntry {
		id: string;
		password: string;
		timestamp: string;
		strength: any; // Using any here since we don't need to import the full type
		source: string; 
	}

	// Export the addToHistory function so it can be imported by other components
	export function addToHistory(password: string, source: string = 'generator') {
		if (!browser || !password.trim()) return;

		const entry: HistoryEntry = {
			id: Date.now().toString(),
			password: password.trim(),
			timestamp: new Date().toISOString(),
			strength: calculatePassphraseStrength(password, {
				generationMode: 'words',
				numWords: 4,
				separator: '-',
				capitalize: true,
				numDigits: 0,
				numSymbols: 0,
				selectedCategories: [],
				numSymPosition: 'append',
				charGrouping: 'together'
			}),
			source
		};

		// Load existing history
		let history: HistoryEntry[] = [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				history = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Failed to load password history:', error);
			history = [];
		}

		// Add to beginning of array and limit size
		history = [entry, ...history.slice(0, MAX_HISTORY_SIZE - 1)];
		
		// Save to localStorage
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
		} catch (error) {
			console.error('Failed to save password history:', error);
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AnimatedStrengthMeter from '$lib/components/AnimatedStrengthMeter.svelte';
	import { type PassphraseStrengthResult } from '$lib/passwordUtils';

	interface HistoryEntry {
		id: string;
		password: string;
		timestamp: string;
		strength: PassphraseStrengthResult;
		source: string; // 'generator', 'template', 'bulk', etc.
	}

	let history: HistoryEntry[] = [];
	let isLoading = true;
	let searchTerm = '';
	let sortBy: 'newest' | 'oldest' | 'strongest' | 'weakest' = 'newest';

	// Use the same constants defined in the module
	// No need to redefine STORAGE_KEY and MAX_HISTORY_SIZE since they're defined in the module

	// Load history from localStorage
	function loadHistory() {
		if (!browser) return;
		
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				history = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Failed to load password history:', error);
			history = [];
		} finally {
			isLoading = false;
		}
	}

	// Clear all history
	function clearHistory() {
		if (confirm('Are you sure you want to clear all password history? This action cannot be undone.')) {
			history = [];
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	}

	// Copy password to clipboard
	async function copyPassword(password: string) {
		if (!navigator.clipboard) return;
		
		try {
			await navigator.clipboard.writeText(password);
		} catch (err) {
			console.error('Failed to copy password:', err);
		}
	}

	// Delete specific history entry
	function deleteEntry(id: string) {
		history = history.filter(entry => entry.id !== id);
		if (browser) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
			} catch (error) {
				console.error('Failed to update password history:', error);
			}
		}
	}

	// Format timestamp for display
	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMinutes < 1) return 'Just now';
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}

	// Get source icon
	function getSourceIcon(source: string): string {
		switch (source) {
			case 'generator': return '🎲';
			case 'template': return '📋';
			case 'bulk': return '📦';
			default: return '🔐';
		}
	}

	// Filter and sort history
	$: filteredHistory = history
		.filter(entry => 
			searchTerm === '' || 
			entry.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.source.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'newest':
					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
				case 'oldest':
					return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
				case 'strongest':
					return b.strength.score - a.strength.score;
				case 'weakest':
					return a.strength.score - b.strength.score;
				default:
					return 0;
			}
		});

	onMount(() => {
		loadHistory();
	});
</script>

<svelte:head>
	<title>Password History - MemPhrase</title>
	<meta name="description" content="View your recently generated passwords with security analysis. Track, copy, and manage your password generation history locally." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Password History
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-3xl">
		View and manage your recently generated passwords. Track security strength, copy previous passwords, 
		and analyze your password generation patterns. All data is stored locally in your browser.
	</p>

	<!-- Controls -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
			<div class="flex items-center gap-4">
				<CustomTooltip text="Search through your password history" position="top">
					<div class="relative">
						<input 
							type="text"
							placeholder="Search passwords or sources..."
							bind:value={searchTerm}
							class="pl-10 pr-4 py-2 w-64 rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
						/>
						<svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</CustomTooltip>
				
				<CustomTooltip text="Sort history entries" position="top">
					<select 
						bind:value={sortBy}
						class="rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="strongest">Strongest First</option>
						<option value="weakest">Weakest First</option>
					</select>
				</CustomTooltip>
			</div>

			<div class="flex items-center gap-3">
				<span class="text-sm text-gray-400">
					{filteredHistory.length} of {history.length} entries
				</span>
				
				<button
					on:click={clearHistory}
					disabled={history.length === 0}
					class="px-4 py-2 border border-red-500 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Clear History
				</button>
			</div>
		</div>

		{#if isLoading}
			<div class="text-center py-8">
				<div class="inline-flex items-center gap-2 text-gray-400">
					<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Loading history...
				</div>
			</div>
		{:else if history.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="mb-4">
					<svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-300 mb-2">No Password History</h3>
				<p class="text-gray-400 mb-6">
					Generate your first password to start building your history. 
					We'll automatically track your last {MAX_HISTORY_SIZE} generated passwords.
				</p>
				<a 
					href="/"
					class="button-gleam inline-flex items-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
				>
					Generate Your First Password
				</a>
			</div>
		{:else if filteredHistory.length === 0}
			<!-- No Search Results -->
			<div class="text-center py-8">
				<h3 class="text-lg font-medium text-gray-300 mb-2">No matching passwords</h3>
				<p class="text-gray-400">Try adjusting your search terms or clearing the search.</p>
			</div>
		{:else}
			<!-- History Entries -->
			<div class="space-y-3">
				{#each filteredHistory as entry (entry.id)}
					<div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
						<div class="flex items-center gap-4 flex-1 min-w-0">
							<div class="flex items-center gap-2 flex-shrink-0">
								<span class="text-lg" title="{entry.source}">{getSourceIcon(entry.source)}</span>
								<div class="text-xs text-gray-400">
									<div>{formatTimestamp(entry.timestamp)}</div>
									<div class="capitalize">{entry.source}</div>
								</div>
							</div>
							
							<button
								on:click={() => copyPassword(entry.password)}
								class="font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 text-left break-all flex-1 min-w-0 cursor-pointer"
								title="Click to copy"
							>
								{entry.password}
							</button>
							
							<div class="flex-shrink-0 w-32">
								<AnimatedStrengthMeter 
									strength={entry.strength} 
									hasError={false}
									showAnimation={false}
								/>
							</div>
						</div>
						
						<button
							on:click={() => deleteEntry(entry.id)}
							class="ml-3 p-2 text-gray-400 hover:text-red-400 transition flex-shrink-0"
							title="Delete this entry"
							aria-label="Delete this password entry"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Statistics -->
	{#if history.length > 0}
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<h3 class="text-lg font-semibold text-gray-100 mb-4">Statistics</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div class="text-center">
					<div class="text-2xl font-bold text-green-400">{history.length}</div>
					<div class="text-sm text-gray-400">Total Generated</div>
				</div>
				
				<div class="text-center">
					<div class="text-2xl font-bold text-blue-400">
						{Math.round(history.reduce((sum, entry) => sum + entry.strength.score, 0) / history.length)}%
					</div>
					<div class="text-sm text-gray-400">Average Strength</div>
				</div>
				
				<div class="text-center">
					<div class="text-2xl font-bold text-purple-400">
						{Math.round(history.reduce((sum, entry) => sum + entry.strength.entropy, 0) / history.length)}
					</div>
					<div class="text-sm text-gray-400">Average Entropy</div>
				</div>
				
				<div class="text-center">
					<div class="text-2xl font-bold text-yellow-400">
						{new Set(history.map(entry => entry.source)).size}
					</div>
					<div class="text-sm text-gray-400">Sources Used</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Info Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">About Password History</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">🔒 Privacy First</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• All history stored locally in your browser</li>
					<li>• No data transmitted to servers</li>
					<li>• Automatically limited to last {MAX_HISTORY_SIZE} passwords</li>
					<li>• Clear history anytime with one click</li>
				</ul>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">📊 Track Patterns</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• Monitor your password security over time</li>
					<li>• See which generation methods you use most</li>
					<li>• Copy previously generated passwords</li>
					<li>• Analyze strength trends and improvements</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			Password history is stored locally in your browser. Clear your browser data to remove all history.
		</p>
	</div>

	<Footer />
</main> 