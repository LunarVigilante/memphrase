<script lang="ts">
	import { browser } from '$app/environment';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AnimatedStrengthMeter from '$lib/components/AnimatedStrengthMeter.svelte';
	import { calculatePassphraseStrength, type PassphraseStrengthResult } from '$lib/passwordUtils';

	interface PasswordAnalysis {
		strength: PassphraseStrengthResult;
		patterns: string[];
		weaknesses: string[];
		suggestions: string[];
		characterSets: {
			hasLowercase: boolean;
			hasUppercase: boolean;
			hasNumbers: boolean;
			hasSymbols: boolean;
			hasSpaces: boolean;
		};
		commonPatterns: {
			hasSequential: boolean;
			hasRepeated: boolean;
			hasKeyboard: boolean;
			hasDates: boolean;
		};
		length: number;
		uniqueChars: number;
	}

	let password = '';
	let analysis: PasswordAnalysis | null = null;
	let showPassword = false;
	let isAnalyzing = false;

	// Common weak patterns
	const SEQUENTIAL_PATTERNS = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def'];
	const KEYBOARD_PATTERNS = ['qwe', 'wer', 'ert', 'rty', 'tyu', 'asd', 'sdf', 'dfg', 'fgh', 'zxc', 'xcv', 'cvb'];
	const COMMON_PASSWORDS = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'monkey', 'dragon'];
	const DATE_PATTERN = /\b(19|20)\d{2}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/;

	// Analyze password comprehensively
	function analyzePassword(pwd: string): PasswordAnalysis {
		const lowerPwd = pwd.toLowerCase();
		
		// Basic character analysis
		const characterSets = {
			hasLowercase: /[a-z]/.test(pwd),
			hasUppercase: /[A-Z]/.test(pwd),
			hasNumbers: /[0-9]/.test(pwd),
			hasSymbols: /[^a-zA-Z0-9\s]/.test(pwd),
			hasSpaces: /\s/.test(pwd)
		};

		// Pattern detection
		const commonPatterns = {
			hasSequential: SEQUENTIAL_PATTERNS.some(pattern => lowerPwd.includes(pattern)),
			hasRepeated: /(.)\1{2,}/.test(pwd), // 3+ repeated characters
			hasKeyboard: KEYBOARD_PATTERNS.some(pattern => lowerPwd.includes(pattern)),
			hasDates: DATE_PATTERN.test(pwd)
		};

		// Calculate basic metrics
		const length = pwd.length;
		const uniqueChars = new Set(pwd).size;
		const charsetCount = Object.values(characterSets).filter(Boolean).length;

		// Get base strength from existing function
		const strength = calculatePassphraseStrength(pwd, {
			generationMode: 'words',
			numWords: 4,
			separator: '-',
			capitalize: true,
			numDigits: 0,
			numSymbols: 0,
			selectedCategories: [],
			numSymPosition: 'append',
			charGrouping: 'together'
		});

		// Detect patterns
		const patterns: string[] = [];
		if (commonPatterns.hasSequential) patterns.push('Sequential characters (123, abc)');
		if (commonPatterns.hasKeyboard) patterns.push('Keyboard patterns (qwe, asd)');
		if (commonPatterns.hasRepeated) patterns.push('Repeated characters (aaa, 111)');
		if (commonPatterns.hasDates) patterns.push('Date patterns');
		if (COMMON_PASSWORDS.some(common => lowerPwd.includes(common))) {
			patterns.push('Common password fragments');
		}

		// Identify weaknesses
		const weaknesses: string[] = [];
		if (length < 8) weaknesses.push('Too short (less than 8 characters)');
		if (length < 12) weaknesses.push('Could be longer (12+ characters recommended)');
		if (charsetCount < 3) weaknesses.push('Limited character variety');
		if (!characterSets.hasUppercase) weaknesses.push('No uppercase letters');
		if (!characterSets.hasNumbers) weaknesses.push('No numbers');
		if (!characterSets.hasSymbols) weaknesses.push('No special symbols');
		if (uniqueChars / length < 0.6) weaknesses.push('Low character diversity');
		if (patterns.length > 0) weaknesses.push('Contains predictable patterns');

		// Generate suggestions
		const suggestions: string[] = [];
		if (length < 12) suggestions.push('Increase length to 12+ characters');
		if (!characterSets.hasUppercase) suggestions.push('Add uppercase letters (A-Z)');
		if (!characterSets.hasNumbers) suggestions.push('Include numbers (0-9)');
		if (!characterSets.hasSymbols) suggestions.push('Add special symbols (!@#$%^&*)');
		if (commonPatterns.hasSequential) suggestions.push('Avoid sequential patterns like 123 or abc');
		if (commonPatterns.hasKeyboard) suggestions.push('Avoid keyboard patterns like qwerty');
		if (commonPatterns.hasRepeated) suggestions.push('Reduce repeated characters');
		if (COMMON_PASSWORDS.some(common => lowerPwd.includes(common))) {
			suggestions.push('Avoid common password words');
		}
		
		// Always add general suggestions
		if (suggestions.length === 0 || strength.score < 80) {
			suggestions.push('Consider using a passphrase with random words');
			suggestions.push('Try our Passphrase Generator for stronger passwords');
		}

		return {
			strength,
			patterns,
			weaknesses,
			suggestions,
			characterSets,
			commonPatterns,
			length,
			uniqueChars
		};
	}

	// Handle password input with debouncing
	let debounceTimer: ReturnType<typeof setTimeout>;
	function handlePasswordChange() {
		if (!password.trim()) {
			analysis = null;
			return;
		}

		clearTimeout(debounceTimer);
		isAnalyzing = true;
		
		debounceTimer = setTimeout(() => {
			analysis = analyzePassword(password);
			isAnalyzing = false;
		}, 300);
	}

	// Copy password to clipboard
	async function copyPassword() {
		if (!navigator.clipboard || !password) return;
		
		try {
			await navigator.clipboard.writeText(password);
		} catch (err) {
			console.error('Failed to copy password:', err);
		}
	}

	// Clear analysis
	function clearAnalysis() {
		password = '';
		analysis = null;
		showPassword = false;
	}

	// Reactive analysis update
	$: {
		handlePasswordChange();
	}
</script>

<svelte:head>
	<title>Password Strength Analyzer - MemPhrase</title>
	<meta name="description" content="Analyze your existing passwords for security weaknesses. Get detailed strength analysis, pattern detection, and improvement suggestions." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-4xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Password Analyzer
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-3xl">
		Analyze your existing passwords for security weaknesses. Get detailed strength analysis, pattern detection, 
		and actionable suggestions to improve your password security. All analysis is performed locally in your browser.
	</p>

	<!-- Password Input -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h2 class="text-xl font-semibold text-gray-100 mb-6">Analyze Your Password</h2>
		
		<div class="space-y-4">
			<div>
				<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
					Enter Password to Analyze
				</label>
				<div class="relative">
					<input 
						type={showPassword ? 'text' : 'password'}
						id="password"
						bind:value={password}
						placeholder="Enter your password here..."
						class="block w-full pr-20 rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
					/>
					<div class="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
						{#if password}
							<button
								on:click={copyPassword}
								class="p-1 text-gray-400 hover:text-gray-200 transition"
								title="Copy password"
								aria-label="Copy password to clipboard"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</button>
						{/if}
						<button
							on:click={() => showPassword = !showPassword}
							class="p-1 text-gray-400 hover:text-gray-200 transition"
							title={showPassword ? 'Hide password' : 'Show password'}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l.786-.786m4.242 4.242l2.829 2.829M14.12 14.12l.786-.786m0 0l1.414-1.414M14.12 14.12L12.707 12.707m2.829 2.829l1.414-1.414M8.464 8.464l1.414-1.414M14.12 14.12L12.707 12.707m-2.829-2.829l1.414-1.414M9.878 9.878L8.464 8.464" />
								</svg>
							{:else}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>

			{#if password}
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-400">
						{password.length} characters • {analysis?.uniqueChars || 0} unique
					</span>
					<button
						on:click={clearAnalysis}
						class="text-sm text-gray-400 hover:text-gray-200 transition"
					>
						Clear
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Analysis Results -->
	{#if isAnalyzing}
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<div class="text-center py-8">
				<div class="inline-flex items-center gap-2 text-gray-400">
					<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Analyzing password...
				</div>
			</div>
		</section>
	{:else if analysis}
		<!-- Strength Overview -->
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<h3 class="text-xl font-semibold text-gray-100 mb-6">Password Strength Analysis</h3>
			
			<AnimatedStrengthMeter 
				strength={analysis.strength} 
				hasError={false}
				showAnimation={true}
			/>
			
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
				<div class="text-center p-3 bg-slate-700/30 rounded-lg">
					<div class="text-lg font-bold text-blue-400">{analysis.length}</div>
					<div class="text-xs text-gray-400">Length</div>
				</div>
				<div class="text-center p-3 bg-slate-700/30 rounded-lg">
					<div class="text-lg font-bold text-purple-400">{analysis.uniqueChars}</div>
					<div class="text-xs text-gray-400">Unique Chars</div>
				</div>
				<div class="text-center p-3 bg-slate-700/30 rounded-lg">
					<div class="text-lg font-bold text-green-400">{Object.values(analysis.characterSets).filter(Boolean).length}</div>
					<div class="text-xs text-gray-400">Char Types</div>
				</div>
				<div class="text-center p-3 bg-slate-700/30 rounded-lg">
					<div class="text-lg font-bold text-yellow-400">{Math.round(analysis.strength.entropy)}</div>
					<div class="text-xs text-gray-400">Entropy Bits</div>
				</div>
			</div>
		</section>

		<!-- Character Composition -->
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<h3 class="text-lg font-semibold text-gray-100 mb-4">Character Composition</h3>
			
			<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
				<div class="flex items-center gap-2 p-3 rounded-lg {analysis.characterSets.hasLowercase ? 'bg-green-900/20 border border-green-500/50' : 'bg-red-900/20 border border-red-500/50'}">
					<div class="text-lg">
						{#if analysis.characterSets.hasLowercase}✅{:else}❌{/if}
					</div>
					<div>
						<div class="text-sm font-medium text-gray-200">Lowercase</div>
						<div class="text-xs text-gray-400">a-z</div>
					</div>
				</div>
				
				<div class="flex items-center gap-2 p-3 rounded-lg {analysis.characterSets.hasUppercase ? 'bg-green-900/20 border border-green-500/50' : 'bg-red-900/20 border border-red-500/50'}">
					<div class="text-lg">
						{#if analysis.characterSets.hasUppercase}✅{:else}❌{/if}
					</div>
					<div>
						<div class="text-sm font-medium text-gray-200">Uppercase</div>
						<div class="text-xs text-gray-400">A-Z</div>
					</div>
				</div>
				
				<div class="flex items-center gap-2 p-3 rounded-lg {analysis.characterSets.hasNumbers ? 'bg-green-900/20 border border-green-500/50' : 'bg-red-900/20 border border-red-500/50'}">
					<div class="text-lg">
						{#if analysis.characterSets.hasNumbers}✅{:else}❌{/if}
					</div>
					<div>
						<div class="text-sm font-medium text-gray-200">Numbers</div>
						<div class="text-xs text-gray-400">0-9</div>
					</div>
				</div>
				
				<div class="flex items-center gap-2 p-3 rounded-lg {analysis.characterSets.hasSymbols ? 'bg-green-900/20 border border-green-500/50' : 'bg-red-900/20 border border-red-500/50'}">
					<div class="text-lg">
						{#if analysis.characterSets.hasSymbols}✅{:else}❌{/if}
					</div>
					<div>
						<div class="text-sm font-medium text-gray-200">Symbols</div>
						<div class="text-xs text-gray-400">!@#$</div>
					</div>
				</div>
				
				<div class="flex items-center gap-2 p-3 rounded-lg {analysis.characterSets.hasSpaces ? 'bg-yellow-900/20 border border-yellow-500/50' : 'bg-slate-700/30 border border-slate-600'}">
					<div class="text-lg">
						{#if analysis.characterSets.hasSpaces}⚠️{:else}➖{/if}
					</div>
					<div>
						<div class="text-sm font-medium text-gray-200">Spaces</div>
						<div class="text-xs text-gray-400">May not work everywhere</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Patterns & Weaknesses -->
		{#if analysis.patterns.length > 0 || analysis.weaknesses.length > 0}
			<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">Security Issues</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#if analysis.patterns.length > 0}
						<div>
							<h4 class="text-md font-medium text-red-400 mb-3">⚠️ Detected Patterns</h4>
							<ul class="space-y-2">
								{#each analysis.patterns as pattern}
									<li class="text-sm text-red-300 bg-red-900/20 p-2 rounded border border-red-500/50">
										{pattern}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
					
					{#if analysis.weaknesses.length > 0}
						<div>
							<h4 class="text-md font-medium text-yellow-400 mb-3">🔍 Weaknesses</h4>
							<ul class="space-y-2">
								{#each analysis.weaknesses as weakness}
									<li class="text-sm text-yellow-300 bg-yellow-900/20 p-2 rounded border border-yellow-500/50">
										{weakness}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</section>
		{/if}

		<!-- Suggestions -->
		{#if analysis.suggestions.length > 0}
			<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
				<h3 class="text-lg font-semibold text-gray-100 mb-4">💡 Improvement Suggestions</h3>
				
				<ul class="space-y-3">
					{#each analysis.suggestions as suggestion}
						<li class="flex items-start gap-3 text-sm text-green-300 bg-green-900/20 p-3 rounded border border-green-500/50">
							<svg class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
							{suggestion}
						</li>
					{/each}
				</ul>
				
				<div class="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/50">
					<h4 class="text-md font-medium text-blue-400 mb-2">🚀 Try Our Tools</h4>
					<div class="flex flex-wrap gap-3">
						<a 
							href="/"
							class="inline-flex items-center rounded-md bg-green-500 hover:bg-green-600 px-3 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
						>
							Passphrase Generator
						</a>
						<a 
							href="/password-templates"
							class="inline-flex items-center rounded-md bg-purple-500 hover:bg-purple-600 px-3 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500"
						>
							Password Templates
						</a>
					</div>
				</div>
			</section>
		{/if}
	{:else if password.trim() === ''}
		<!-- Instructions -->
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<div class="text-center py-8">
				<div class="mb-4">
					<svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-300 mb-2">Enter a Password to Analyze</h3>
				<p class="text-gray-400 mb-6">
					Paste any password to get detailed security analysis, pattern detection, and improvement suggestions.
				</p>
			</div>
		</section>
	{/if}

	<!-- Features Info -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Analysis Features</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">🔍 Pattern Detection</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• Sequential characters (123, abc)</li>
					<li>• Keyboard patterns (qwerty)</li>
					<li>• Repeated characters (aaa)</li>
					<li>• Common password fragments</li>
					<li>• Date patterns</li>
				</ul>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">📊 Strength Analysis</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• Character composition</li>
					<li>• Length and complexity</li>
					<li>• Entropy calculation</li>
					<li>• Uniqueness assessment</li>
					<li>• Overall security score</li>
				</ul>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">💡 Smart Suggestions</h4>
				<ul class="text-sm text-gray-300 space-y-1">
					<li>• Specific improvement recommendations</li>
					<li>• Character set enhancement</li>
					<li>• Pattern avoidance tips</li>
					<li>• Length optimization</li>
					<li>• Alternative approaches</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			All password analysis is performed locally in your browser. No passwords are transmitted to servers.
		</p>
	</div>

	<Footer />
</main> 