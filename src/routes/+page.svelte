<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { fade, slide } from 'svelte/transition'; // Added slide transition
	import CustomTooltip from '$lib/components/CustomTooltip.svelte'; // Import the new component
	import {
		generatePassphraseService,
		type PassphraseOptions,
		calculatePassphraseStrength,
		type PassphraseStrengthResult,
		DEFAULT_PASSPHRASE_SYMBOLS // Import default symbols
	} from '../lib/passwordUtils';
	import { categories as wordListCategories, defaultCategories as defaultLeafCategories, getCategoryByName, type WordCategory } from '$lib/words'; // Import categories
	import SymbolSelectorModal from '$lib/components/SymbolSelectorModal.svelte'; // Import the modal

	interface PassPoetSettings {
		numWords: number;
		separator: string;
		capitalize: boolean;
		numDigits: number; // For word-based
		numSymbols: number; // For word-based
		selectedCategories: string[];
		numSymPosition: 'append' | 'prepend' | 'interspersed';
		autoCopy: boolean;
		charGrouping?: 'together' | 'separate';
		wordCategoriesOpen?: boolean;
		numbersSymbolsOpen?: boolean;

		// New settings for generation mode
		generationMode: 'words' | 'randomChars';
		randomPasswordLength?: number;
		randomIncludeLowercase?: boolean;
		randomIncludeUppercase?: boolean;
		randomIncludeNumbers?: boolean;
		randomIncludeSymbols?: boolean;
		randomCharsOptionsOpen?: boolean; // For collapsible section
		customSymbolsWordMode: string[];
		customSymbolsRandomMode: string[];
	}

	const SETTINGS_KEY = 'passPoetSettings';
	let appInitialized = false; // Flag to prevent premature saves/generations

	// State for passphrase generation - with new defaults
	let numWords = 3;
	let separator = '-';
	let capitalize = true;
	let numDigits = 2; // For word-based
	let numSymbols = 1; // For word-based
	let selectedCategories: string[] = [...defaultLeafCategories];
	let numSymPosition: 'append' | 'prepend' | 'interspersed' = 'append';
	let autoCopy = false;
	let charGrouping: 'together' | 'separate' = 'together';

	// New state for generation mode
	let generationMode: 'words' | 'randomChars' = 'words';
	let randomPasswordLength = 16;
	let randomIncludeLowercase = true;
	let randomIncludeUppercase = true;
	let randomIncludeNumbers = true;
	let randomIncludeSymbols = true;
	let randomCharsOptionsOpen = false; // Default to closed
	let customSymbolsWordMode: string[] = DEFAULT_PASSPHRASE_SYMBOLS.split('');
	let customSymbolsRandomMode: string[] = DEFAULT_PASSPHRASE_SYMBOLS.split('');
	let showSymbolModal = false;
	let editingSymbolSetFor: 'words' | 'randomChars' = 'words'; // To track which set modal edits

	// State for collapsible sections - default to closed
	let wordCategoriesOpen = false;
	let numbersSymbolsOpen = false;

	// Clamping for numDigits and numSymbols to 0-5 range (Word mode specific)
	$: numDigitsForWordMode = Math.max(0, Math.min(5, Number(numDigits) || 0));
	$: numSymbolsForWordMode = Math.max(0, Math.min(5, Number(numSymbols) || 0));

	// Ensure numDigits/numSymbols is at least 1 if respective include is true (Word mode)
	// These are now effectively controlled by the user directly setting numDigits/numSymbols
	// Let's re-evaluate if includeNumber/Symbol checkboxes are still needed for word mode, or if numDigits > 0 implies inclusion.
	// For now, removing the direct link from includeNumber/Symbol checkboxes for word mode to numDigits/numSymbols here.
	// The UI will have separate checkboxes for number/symbol inclusion in word mode vs random char mode.

	// Clamping for randomPasswordLength
	$: randomPasswordLength = Math.max(8, Math.min(128, Number(randomPasswordLength) || 8));
	$: randomSliderFillPercent = randomPasswordLength <= 8 ? 0 : ((randomPasswordLength - 8) / (128 - 8)) * 100;

	let passphrase = '';
	let prevPassphrase = ''; // To track changes to passphrase for afterUpdate
	let passphraseStrength: PassphraseStrengthResult | null = null; // State for strength

	let copyButtonText = 'Copy';

	// Calculate fill percentage for custom slider (new min 1, new max 7)
	$: sliderFillPercent = numWords <= 1 ? 0 : ((numWords - 1) / (7 - 1)) * 100;

	const rawCheckmarkSvg = `<svg viewBox="0 0 16 16" fill="#22C55E" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>`;
	$: checkmarkDataUrl = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawCheckmarkSvg)}")`;

	// Custom tooltip state
	let showCustomTooltip = false;
	let tooltipText = "";

	let previousPassphrase = "";
	let canShowPrevious = false;

	$: noCategoriesSelectedError = selectedCategories.length === 0;

	// Reactive trigger for settings changes
	$: settingsSignature = `${generationMode}-${numWords}-${separator}-${capitalize}-${numDigitsForWordMode}-${numSymbolsForWordMode}-${selectedCategories.join(',')}-${numSymPosition}-${autoCopy}-${charGrouping}-${randomPasswordLength}-${randomIncludeLowercase}-${randomIncludeUppercase}-${randomIncludeNumbers}-${randomIncludeSymbols}-${randomCharsOptionsOpen}-${customSymbolsWordMode.join('')}-${customSymbolsRandomMode.join('')}`;

	let initialSignature = '';
	let initialSignatureCaptured = false;

	function handleMouseEnterPassphrase() {
		if (passphrase && passphrase.length > 25) { // Only show if long enough
			tooltipText = passphrase;
			showCustomTooltip = true;
		}
	}

	function handleMouseLeavePassphrase() {
		showCustomTooltip = false;
	}

	// Function to update the strength meter based on current passphrase and options
	function updateStrengthDisplay() {
		const currentOpts: PassphraseOptions = {
			generationMode,
			// Word-based options
			numWords,
			separator,
			capitalize,
			numDigits: generationMode === 'words' ? numDigitsForWordMode : 0,
			numSymbols: generationMode === 'words' ? numSymbolsForWordMode : 0,
			selectedCategories: generationMode === 'words' ? selectedCategories : [],
			numSymPosition,
			charGrouping,
			// Random char options
			randomPasswordLength: generationMode === 'randomChars' ? randomPasswordLength : undefined,
			randomIncludeLowercase: generationMode === 'randomChars' ? randomIncludeLowercase : undefined,
			randomIncludeUppercase: generationMode === 'randomChars' ? randomIncludeUppercase : undefined,
			randomIncludeNumbers: generationMode === 'randomChars' ? randomIncludeNumbers : undefined,
			randomIncludeSymbols: generationMode === 'randomChars' ? randomIncludeSymbols : undefined,
			customSymbols: generationMode === 'words' ? customSymbolsWordMode : customSymbolsRandomMode
		};
		// If an error message is the passphrase, reflect that in strength display
		if (passphrase.startsWith('Error:') || passphrase.startsWith('Invalid Options')) {
			passphraseStrength = { score: 0, label: '-', colorClass: 'text-red-400', entropy: 0 };
		} else {
			passphraseStrength = calculatePassphraseStrength(passphrase, currentOpts);
		}
	}

	function generatePassphrase() {
		const currentValidPassphrase = passphrase && !passphrase.startsWith('Error:') && !passphrase.startsWith('Invalid Options');

		if (generationMode === 'words' && noCategoriesSelectedError) {
			if (currentValidPassphrase) {
				previousPassphrase = passphrase;
				canShowPrevious = true;
			} else {
				canShowPrevious = !!previousPassphrase;
			}
			passphrase = 'Invalid Options: Select word categories';
			return;
		}
		if (generationMode === 'randomChars' && !randomIncludeLowercase && !randomIncludeUppercase && !randomIncludeNumbers && !randomIncludeSymbols) {
			if (currentValidPassphrase) {
				previousPassphrase = passphrase;
				canShowPrevious = true;
			} else {
				canShowPrevious = !!previousPassphrase;
			}
			passphrase = 'Invalid Options: Select character types';
			return;
		}

		const optionsToGenerate: PassphraseOptions = {
			generationMode,
			// Word-based options
			numWords,
			separator,
			capitalize,
			numDigits: generationMode === 'words' ? numDigitsForWordMode : 0,
			numSymbols: generationMode === 'words' ? numSymbolsForWordMode : 0,
			selectedCategories: generationMode === 'words' ? selectedCategories : [],
			numSymPosition,
			charGrouping,
			// Random char options
			randomPasswordLength: generationMode === 'randomChars' ? randomPasswordLength : undefined,
			randomIncludeLowercase: generationMode === 'randomChars' ? randomIncludeLowercase : undefined,
			randomIncludeUppercase: generationMode === 'randomChars' ? randomIncludeUppercase : undefined,
			randomIncludeNumbers: generationMode === 'randomChars' ? randomIncludeNumbers : undefined,
			randomIncludeSymbols: generationMode === 'randomChars' ? randomIncludeSymbols : undefined,
			customSymbols: generationMode === 'words' ? customSymbolsWordMode : customSymbolsRandomMode
		};
		const newPassphrase = generatePassphraseService(optionsToGenerate);

		if (currentValidPassphrase && passphrase !== newPassphrase) {
			previousPassphrase = passphrase;
			canShowPrevious = true;
		} else if (!currentValidPassphrase && newPassphrase && !newPassphrase.startsWith('Error:')) {
			// This is the first successful generation after an error or initial load with no valid previous.
			// previousPassphrase remains as it was, canShowPrevious depends on if previousPassphrase has content.
			canShowPrevious = !!previousPassphrase; 
		} else if (newPassphrase.startsWith('Error:')) {
			// If generation results in an error (should be caught by noCategoriesSelectedError, but as a fallback)
			canShowPrevious = !!previousPassphrase;
		}

		passphrase = newPassphrase;

		// Auto-copy if enabled and passphrase is valid
		if (autoCopy && passphrase && !passphrase.startsWith('Error:') && !passphrase.startsWith('Invalid Options')) {
			copyPassword();
		}
	}

	function showPreviousPassphrase() {
		if (canShowPrevious && previousPassphrase) {
			const temp = passphrase;
			passphrase = previousPassphrase;
			previousPassphrase = temp; // What was current becomes the new previous
			// If the new previousPassphrase is an error/invalid, don't allow showing it again via this swap.
			canShowPrevious = !!previousPassphrase && !previousPassphrase.startsWith('Error:') && !previousPassphrase.startsWith('Invalid Options');
			// Strength and entropy will update via afterUpdate because `passphrase` changed.
		}
	}

	async function copyPassword() {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported');
			return;
		}
		try {
			await navigator.clipboard.writeText(passphrase); // Copy passphrase
			copyButtonText = 'Copied!';
			setTimeout(() => {
				copyButtonText = 'Copy';
			}, 1500);
		} catch (err) {
			console.error('Failed to copy passphrase: ', err);
		}
	}

	// Save settings to localStorage when they change
	$: if (appInitialized) {
		const currentSettings: PassPoetSettings = {
			numWords,
			separator,
			capitalize,
			numDigits: numDigitsForWordMode,
			numSymbols: numSymbolsForWordMode,
			selectedCategories,
			numSymPosition,
			autoCopy,
			charGrouping,
			wordCategoriesOpen,
			numbersSymbolsOpen,
			// New settings
			generationMode,
			randomPasswordLength,
			randomIncludeLowercase,
			randomIncludeUppercase,
			randomIncludeNumbers,
			randomIncludeSymbols,
			randomCharsOptionsOpen,
			customSymbolsWordMode,
			customSymbolsRandomMode
		};
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
	}

	onMount(() => {
		const savedSettings = localStorage.getItem(SETTINGS_KEY);
		if (savedSettings) {
			try {
				const parsedSettings: PassPoetSettings = JSON.parse(savedSettings);
				numWords = parsedSettings.numWords || 4;
				separator = parsedSettings.separator || '.';
				capitalize = parsedSettings.capitalize === undefined ? true : parsedSettings.capitalize;
				// numDigits and numSymbols are for word-based
				numDigits = parsedSettings.numDigits === undefined ? 2 : Number(parsedSettings.numDigits);
				numSymbols = parsedSettings.numSymbols === undefined ? 1 : Number(parsedSettings.numSymbols);
				
				selectedCategories = Array.isArray(parsedSettings.selectedCategories) && parsedSettings.selectedCategories.length > 0 
									 ? parsedSettings.selectedCategories 
									 : [...defaultLeafCategories];
				numSymPosition = (parsedSettings.numSymPosition === 'prepend' || parsedSettings.numSymPosition === 'interspersed') ? parsedSettings.numSymPosition : 'append';
				autoCopy = parsedSettings.autoCopy === undefined ? false : parsedSettings.autoCopy;
				charGrouping = (parsedSettings.charGrouping === 'separate') ? 'separate' : 'together';
				wordCategoriesOpen = parsedSettings.wordCategoriesOpen === undefined ? false : parsedSettings.wordCategoriesOpen;
				numbersSymbolsOpen = parsedSettings.numbersSymbolsOpen === undefined ? false : parsedSettings.numbersSymbolsOpen;

				// Load new settings
				generationMode = (parsedSettings.generationMode === 'randomChars') ? 'randomChars' : 'words';
				randomPasswordLength = parsedSettings.randomPasswordLength === undefined ? 16 : Number(parsedSettings.randomPasswordLength);
				randomIncludeLowercase = parsedSettings.randomIncludeLowercase === undefined ? true : parsedSettings.randomIncludeLowercase;
				randomIncludeUppercase = parsedSettings.randomIncludeUppercase === undefined ? true : parsedSettings.randomIncludeUppercase;
				randomIncludeNumbers = parsedSettings.randomIncludeNumbers === undefined ? true : parsedSettings.randomIncludeNumbers;
				randomIncludeSymbols = parsedSettings.randomIncludeSymbols === undefined ? true : parsedSettings.randomIncludeSymbols;
				randomCharsOptionsOpen = parsedSettings.randomCharsOptionsOpen === undefined ? false : parsedSettings.randomCharsOptionsOpen;
				customSymbolsWordMode = Array.isArray(parsedSettings.customSymbolsWordMode) && parsedSettings.customSymbolsWordMode.length > 0
									? parsedSettings.customSymbolsWordMode
									: DEFAULT_PASSPHRASE_SYMBOLS.split('');
				customSymbolsRandomMode = Array.isArray(parsedSettings.customSymbolsRandomMode) && parsedSettings.customSymbolsRandomMode.length > 0
									? parsedSettings.customSymbolsRandomMode
									: DEFAULT_PASSPHRASE_SYMBOLS.split('');

			} catch (e) {
				console.error('Failed to parse PassPoet settings from localStorage', e);
			}
		}
		generatePassphrase(); 
		initialSignature = settingsSignature; 
    	setTimeout(() => {
      		appInitialized = true;
			initialSignatureCaptured = true; // Mark as captured
    	}, 0); 
	});

	// Regenerate passphrase when options change (only after initialization and if signature actually changes)
	$: if (settingsSignature && appInitialized && initialSignatureCaptured && settingsSignature !== initialSignature) {
    	generatePassphrase();
		initialSignature = settingsSignature; // Update signature to prevent re-trigger from this same generation
	}

	// afterUpdate will run after the DOM has been updated
	afterUpdate(() => {
		if (passphrase !== prevPassphrase) {
			updateStrengthDisplay();
			prevPassphrase = passphrase; // Update previous passphrase tracker
		}
	});

	// Helper to determine if a parent category should be displayed as checked (all children selected)
	function isParentChecked(parentCategory: WordCategory): boolean {
		if (!parentCategory.subCategories || parentCategory.subCategories.length === 0) return false;
		return parentCategory.subCategories.every(subCat => selectedCategories.includes(subCat.name));
	}

	// Helper to determine if a parent category should be indeterminate (some but not all children selected)
	function isParentIndeterminate(parentCategory: WordCategory): boolean {
		if (!parentCategory.subCategories || parentCategory.subCategories.length === 0) return false;
		const selectedChildrenCount = parentCategory.subCategories.filter(subCat => selectedCategories.includes(subCat.name)).length;
		return selectedChildrenCount > 0 && selectedChildrenCount < parentCategory.subCategories.length;
	}

	function handleParentCategoryToggle(parentCategory: WordCategory) {
		if (!parentCategory.subCategories) return;
		const allChildrenSelected = isParentChecked(parentCategory);
		const newSelectedCategories = [...selectedCategories];

		parentCategory.subCategories.forEach(subCat => {
			const index = newSelectedCategories.indexOf(subCat.name);
			if (allChildrenSelected) { // Parent was fully checked, so uncheck all children
				if (index !== -1) newSelectedCategories.splice(index, 1);
			} else { // Parent was not fully checked (or indeterminate), so check all children
				if (index === -1) newSelectedCategories.push(subCat.name);
			}
		});
		selectedCategories = newSelectedCategories;
	}

	// Function to handle individual leaf category checkbox clicks (ensures noCategoriesSelectedError updates)
	// This will be implicitly handled by bind:group, but if specific logic needed on click, use it.
	// For now, bind:group on leaf categories is sufficient.

	function resetToDefaults() {
		// Word-based defaults
		numWords = 3;
		separator = '-';
		capitalize = true;
		numDigits = 2;
		numSymbols = 1;
		selectedCategories = [...defaultLeafCategories];
		numSymPosition = 'append';
		charGrouping = 'together';
		wordCategoriesOpen = false; 
		numbersSymbolsOpen = false;
		
		// Random char defaults
		randomPasswordLength = 16;
		randomIncludeLowercase = true;
		randomIncludeUppercase = true;
		randomIncludeNumbers = true;
		randomIncludeSymbols = true;
		randomCharsOptionsOpen = false;
		customSymbolsWordMode = DEFAULT_PASSPHRASE_SYMBOLS.split('');
		customSymbolsRandomMode = DEFAULT_PASSPHRASE_SYMBOLS.split('');

		// General defaults
		generationMode = 'words';
		autoCopy = false;

		// The reactive settingsSignature will handle regeneration and saving
	}

	const currentYear = new Date().getFullYear();

	function openSymbolModal(mode: 'words' | 'randomChars') {
		editingSymbolSetFor = mode;
		showSymbolModal = true;
	}

	function handleSymbolSave(event: CustomEvent<string[]>) {
		if (editingSymbolSetFor === 'words') {
			customSymbolsWordMode = event.detail;
		} else {
			customSymbolsRandomMode = event.detail;
		}
		// Optionally regenerate passphrase immediately if settingsSignature reacts to these changes
		// or if we manually call generatePassphrase() - already happens due to settingsSignature change
	}

</script>

<svelte:head>
	<title>MemPhrase - Memorable Passphrase Generator</title>
	<meta name="description" content="A simple memorable passphrase generator - MemPhrase" />
</svelte:head>

<style>
	input[type='range'].custom-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px; /* Corresponds to h-2 */
		background: #4b5563; /* bg-gray-600 */
		border-radius: 8px; /* Corresponds to rounded-lg */
		outline: none;
		cursor: pointer;
	}

	/* Thumb styling for WebKit (Chrome, Safari, Edge) */
	input[type='range'].custom-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: -6px; /* (Thumb height - Track height) / 2 -> (20px - 8px) / 2 = 6px. Negative. */
		width: 20px;
		height: 20px;
		background: #22c55e; /* bg-green-500 */
		border-radius: 50%;
		cursor: pointer;
	}

	/* Thumb styling for Firefox */
	input[type='range'].custom-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #22c55e; /* bg-green-500 */
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	/* Track fill for WebKit */
	input[type='range'].custom-slider::-webkit-slider-runnable-track {
		width: 100%;
		height: 8px;
		cursor: pointer;
		background: linear-gradient(to right, #22c55e var(--slider-fill-percent, 0%), #4b5563 var(--slider-fill-percent, 0%));
		border-radius: 8px;
	}

	/* Track and progress fill for Firefox */
	input[type='range'].custom-slider::-moz-range-track {
		width: 100%;
		height: 8px;
		background: #4b5563; /* bg-gray-600 */
		border-radius: 8px;
		cursor: pointer;
	}
	input[type='range'].custom-slider::-moz-range-progress {
		height: 8px;
		background-color: #22c55e; /* bg-green-500 */
		border-radius: 8px;
	}

	/* Custom Checkbox Styling */
	.custom-checkbox {
		appearance: none;
		-webkit-appearance: none;
		width: 1.25rem; /* w-5 */
		height: 1.25rem; /* h-5 */
		border-radius: 0.375rem; /* rounded-md */
		border: 1px solid #6B7280; /* border-gray-500 for slightly more contrast */
		background-color: #374151; /* bg-gray-700 */
		display: inline-block;
		vertical-align: middle;
		position: relative;
		cursor: pointer;
	}

	.custom-checkbox:checked {
		border-color: #22C55E; /* border-green-500 */
		background-image: var(--checkmark-url);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 70%;
	}

	/* Keep Tailwind focus utility, but ensure it's on the custom styled part if label is clicked */
	/* Or, ensure the input itself gets focus styles that are visible */
	.custom-checkbox:focus {
		/* Tailwind focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 */
		/* These are applied via classes, custom CSS here is for the box itself if needed */
		outline: 2px solid transparent;
    	outline-offset: 2px;
    	box-shadow: 0 0 0 2px var(--tw-ring-offset-color, transparent), 0 0 0 calc(2px + 2px) var(--tw-ring-color, transparent), var(--tw-shadow, 0 0 #0000);
	}
	.custom-checkbox:focus {
		--tw-ring-color: #22C55E;
		--tw-ring-offset-color: #1E293B; /* dark:focus:ring-offset-slate-800 */
	}

	/* Custom Radio Button Styling (basic, can be enhanced like checkboxes) */
	.custom-radio {
		appearance: none;
		-webkit-appearance: none;
		width: 1.25rem; /* w-5 */
		height: 1.25rem; /* h-5 */
		border-radius: 50%; /* circular */
		border: 1px solid #6B7280; /* border-gray-500 */
		background-color: #374151; /* bg-gray-700 */
		display: inline-block;
		vertical-align: middle;
		position: relative;
		cursor: pointer;
	}

	.custom-radio:checked {
		border-color: #22C55E; /* border-green-500 */
		background-color: #374151; /* Keep same bg or change if desired */
	}

	/* Inner circle for checked state */
	.custom-radio:checked::after {
		content: '';
		display: block;
		width: 0.65rem; /* Smaller inner circle */
		height: 0.65rem;
		border-radius: 50%;
		background-color: #22C55E; /* green-500 */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.custom-radio:focus {
		outline: 2px solid transparent;
    	outline-offset: 2px;
    	box-shadow: 0 0 0 2px var(--tw-ring-offset-color, transparent), 0 0 0 calc(2px + 2px) var(--tw-ring-color, transparent), var(--tw-shadow, 0 0 #0000);
	}
	.custom-radio:focus {
		--tw-ring-color: #22C55E;
		--tw-ring-offset-color: #1E293B; /* dark:focus:ring-offset-slate-800 */
	}
</style>

<main
	class="container mx-auto mt-1 flex max-w-2xl flex-col items-center gap-8 p-4 md:mt-3 md:p-6"
>
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			MemPhrase
		</h1>
	</div>

	<!-- Passphrase Display (MOVED Password Type below this) -->
	<section
		class="relative flex h-16 w-full items-center gap-3 rounded-lg bg-slate-700 p-4 shadow-lg transition-colors duration-200 {noCategoriesSelectedError ? 'border-red-500' : 'border-green-500'}"
	>
		<span class="flex-grow truncate font-mono text-2xl {noCategoriesSelectedError ? 'text-red-400' : 'text-gray-50'}"
				role="status" 
				aria-live="polite"
				on:mouseenter={handleMouseEnterPassphrase}
				on:mouseleave={handleMouseLeavePassphrase}
				aria-describedby={showCustomTooltip ? "custom-passphrase-tooltip" : undefined}
			>{passphrase}</span
		> 
		<button
			on:click={copyPassword}
			class="button-gleam min-w-[70px] rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60 dark:focus:ring-offset-slate-700 {copyButtonText === 'Copied!' ? 'bg-emerald-700' : 'bg-green-500 hover:bg-green-600'}"
			aria-label="Copy passphrase"
			disabled={copyButtonText === 'Copied!' || noCategoriesSelectedError}
		>
			{copyButtonText}
		</button>

		{#if canShowPrevious}
			<button
				on:click={showPreviousPassphrase}
				class="ml-2 min-w-[70px] rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 active:bg-slate-500 dark:focus:ring-offset-slate-800 {canShowPrevious ? 'bg-slate-600 border-slate-500 text-gray-200 hover:bg-slate-500 hover:text-gray-100 active:text-gray-100' : 'opacity-50 cursor-not-allowed border-slate-700 text-gray-500'}"
				aria-label="Show previous passphrase"
				disabled={!canShowPrevious} 
			>
				Previous
			</button>
		{/if}

		<!-- CUSTOM TOOLTIP ELEMENT -->
		{#if showCustomTooltip && !noCategoriesSelectedError}
			<div
				id="custom-passphrase-tooltip"
				transition:fade={{ duration: 150 }}
				role="tooltip"
				class="absolute z-20 px-3 py-2 text-xs font-medium text-gray-100 bg-slate-800 rounded-lg shadow-lg whitespace-normal break-words"
				style="
					bottom: 100%;
					left: 50%;
					transform: translateX(-50%) translateY(-8px);
					min-width: 150px;
					max-width: 300px;
				"
			>
				{tooltipText}
				<div class="absolute w-0 h-0 border-8 border-transparent border-t-slate-800"
					 style="
						top: 100%;
						left: 50%;
						transform: translateX(-50%);
					 ">
				</div>
			</div>
		{/if}
	</section>

	<!-- Passphrase Strength Indicator -->
	{#if passphraseStrength}
		<div class="w-full">
			<div class="flex justify-center items-baseline text-center">
				<span class="text-sm font-medium text-gray-300 mr-1">Strength:</span>
				<span class={`font-semibold mr-1 ${noCategoriesSelectedError ? 'text-red-400' : passphraseStrength.colorClass}`}>
					{passphraseStrength.label}
				</span>
				{#if !noCategoriesSelectedError && passphraseStrength.entropy > 0}
					<CustomTooltip
						text={`Entropy (bits): Measures unpredictability. Higher is better.`}
						position="top"
					>
						<span role="status" class="text-xs text-gray-500 italic">({passphraseStrength.entropy.toFixed(1)} bits)</span>
					</CustomTooltip>
				{/if}
			</div>
			<div class="mt-1 h-2 w-full rounded-full bg-slate-700 overflow-hidden">
				<div
					class={`strength-bar-fill h-full rounded-full transition-all duration-300 ease-in-out ${noCategoriesSelectedError ? 'bg-red-500' : (passphraseStrength.colorClass ? passphraseStrength.colorClass.replace('text-', 'bg-') : 'bg-gray-500')}`}
					style={`width: ${noCategoriesSelectedError ? '100%' : (((passphraseStrength.score || 0) / 4) * 100)}%`}
				></div>
			</div>
		</div>
	{/if}

	<!-- Generate Button -->
	<button
		on:click={generatePassphrase}
		class="button-gleam w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-xl font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 active:bg-emerald-700 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 mt-2"
		disabled={
			(generationMode === 'words' && selectedCategories.length === 0) || 
			(generationMode === 'randomChars' && !randomIncludeLowercase && !randomIncludeUppercase && !randomIncludeNumbers && !randomIncludeSymbols)
		}
	>
		{generationMode === 'words' ? 'Generate Passphrase' : 'Generate Password'}
	</button>

	<!-- Passphrase Settings Card -->
	<section
		class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl transition-colors duration-200 mt-4"
	>
		<!-- Generation Mode Selection (MOVED INSIDE CARD, NO HEADER) -->
		<div class="flex justify-center gap-4 mb-6">
			<label class="flex items-center gap-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-700 {generationMode === 'words' ? 'bg-green-600 text-white radio-label-gleam' : 'bg-slate-600 text-gray-300'} transition-colors">
				<input type="radio" bind:group={generationMode} name="generationMode" value="words" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
				<span>Word-based (Memorable)</span>
			</label>
			<label class="flex items-center gap-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-700 {generationMode === 'randomChars' ? 'bg-green-600 text-white radio-label-gleam' : 'bg-slate-600 text-gray-300'} transition-colors">
				<input type="radio" bind:group={generationMode} name="generationMode" value="randomChars" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
				<span>Random Characters (Strong)</span>
			</label>
		</div>

		{#if generationMode === 'words'}
			<!-- WORD-BASED OPTIONS (Existing Layout) -->
			<div class="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
				<!-- Column 1: Passphrase Structure -->
				<div class="space-y-6">
					<!-- Word Count Slider -->
					<div class="w-full">
						<CustomTooltip text="Total number of words in your passphrase (1-7). More words significantly increase strength and memorability." position="top">
							<div class="space-y-2">
								<label for="numWords" class="block text-sm font-medium text-gray-300">Number of Words: <span class="font-bold text-green-400">{numWords}</span></label>
								<input type="range" id="numWords" name="numWords" min="1" max="7" step="1" bind:value={numWords} style="--slider-fill-percent: {sliderFillPercent}%" class="custom-slider w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
							</div>
						</CustomTooltip>
					</div>

					<!-- Word Categories -->
					<fieldset class="mt-4 rounded-lg {noCategoriesSelectedError && wordCategoriesOpen ? 'border border-red-500 p-3' : 'border-transparent'}">
						<CustomTooltip text="Settings for word-based part of the passphrase." position="top">
							<button 
								type="button"
								on:click={() => wordCategoriesOpen = !wordCategoriesOpen}
								aria-expanded={wordCategoriesOpen}
								aria-controls="word-categories-content"
								class="w-full flex justify-between items-center text-left text-sm font-medium mb-2 p-2 rounded-t-md bg-slate-800 hover:bg-slate-700 border-b border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
							>
								<span class="{noCategoriesSelectedError && !wordCategoriesOpen ? 'text-red-400' : 'text-gray-200'}">Word Categories</span>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transform transition-transform duration-200 text-gray-400 {wordCategoriesOpen ? 'rotate-0' : '-rotate-90'}">
									<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
								</svg>
							</button>
						</CustomTooltip>
						{#if wordCategoriesOpen}
							<div id="word-categories-content" class="space-y-3 pt-3 pb-1 px-1" transition:slide={{ duration: 200 }}>
								{#each wordListCategories as category (category.name)}
									{#if category.isParent && category.subCategories && category.subCategories.length > 0}
										<!-- Parent Category -->
										<div class="space-y-1">
											<CustomTooltip text="Toggle all {category.name.toLowerCase()} sub-categories" position="top">
												<button 
													type="button"
													on:click={() => handleParentCategoryToggle(category)}
													class="flex items-center gap-x-3 cursor-pointer w-full p-1 hover:bg-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
												>
													<input type="checkbox" checked={isParentChecked(category)} indeterminate={isParentIndeterminate(category)} tabindex="-1" class="custom-checkbox pointer-events-none" style={`--checkmark-url: ${checkmarkDataUrl}`} />
													<span class="text-sm font-semibold text-gray-200 select-none">{category.name}</span>
												</button>
											</CustomTooltip>
											{#if isParentChecked(category) || isParentIndeterminate(category)}
												<div class="pl-7 space-y-2 pt-1 pb-1">
													{#each category.subCategories as subCategory (subCategory.name)}
														<CustomTooltip text="e.g., {subCategory.words?.slice(0,3).join(', ')}{subCategory.words && subCategory.words.length > 3 ? '...' : ''}" position="right">
															<label class="flex items-center gap-x-3 cursor-pointer p-1 hover:bg-slate-700 rounded-md">
																<input type="checkbox" value={subCategory.name} bind:group={selectedCategories} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
																<span class="text-sm text-gray-300 select-none hover:text-gray-100">{subCategory.name}</span>
															</label>
														</CustomTooltip>
													{/each}
												</div>
											{/if}
										</div>
									{:else if !category.isParent && category.words}
										<!-- Direct Leaf Category (e.g., Verbs) -->
										<CustomTooltip text="e.g., {category.words?.slice(0,3).join(', ')}{category.words && category.words.length > 3 ? '...' : ''}" position="top">
											<label class="flex items-center gap-x-3 cursor-pointer p-1 hover:bg-slate-700 rounded-md">
												<input 
													type="checkbox" 
													value={category.name} 
													bind:group={selectedCategories}
													class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
													style={`--checkmark-url: ${checkmarkDataUrl}`}
												/>
												<span class="text-sm text-gray-300 select-none hover:text-gray-100">{category.name}</span>
											</label>
										</CustomTooltip>
									{/if}
								{/each}
							</div>
						{/if}
						{#if noCategoriesSelectedError && wordCategoriesOpen}
							<p class="text-xs text-red-400 pt-2 px-1">Please select at least one category.</p>
						{/if}
					</fieldset>
				</div>

				<!-- Column 2: Character Additions & Formatting -->
				<div class="space-y-6">
					<div class="flex flex-wrap items-start gap-x-6 gap-y-4 md:gap-y-0">
						<!-- General Options -->
						<fieldset class="min-w-[200px] flex-1 md:flex-grow-[2]">
							<CustomTooltip text="General formatting options for the word-based passphrase." position="top">
								<legend class="block text-sm font-medium text-gray-300 mb-2">Word Formatting</legend>
							</CustomTooltip>
							<div class="grid grid-cols-1 gap-3">
								<CustomTooltip text="Capitalize the first letter of each word. e.g., QuickBrownFox." position="top">
									<label class="flex items-center gap-x-3 cursor-pointer">
										<input type="checkbox" bind:checked={capitalize} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
										<span class="text-sm text-gray-300 select-none hover:text-gray-100">Capitalize Words</span>
									</label>
								</CustomTooltip>
								<CustomTooltip text="Automatically copy the generated passphrase to your clipboard." position="top">
									<label class="flex items-center gap-x-3 cursor-pointer">
										<input type="checkbox" bind:checked={autoCopy} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
										<span class="text-sm text-gray-300 select-none hover:text-gray-100">Auto-copy new passphrase</span>
									</label>
								</CustomTooltip>
							</div>
						</fieldset>

						<!-- Separator -->
						<div class="flex-1 flex justify-center md:flex-grow-[1]">
							<CustomTooltip text="Character(s) to place between words (and numbers/symbols if at ends). E.g., ., _, or space." position="top">
								<div class="mt-4 md:mt-8 flex flex-col items-center">
									<label for="separator" class="mb-1 block text-sm font-medium text-gray-300">Separator</label>
									<input 
										type="text" 
										id="separator" 
										bind:value={separator}
										class="block w-20 rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-center"
									/>
								</div>
							</CustomTooltip>
						</div>
					</div>

					<hr class="my-4 border-gray-600">

					<!-- Numbers & Symbols -->
					<fieldset class="mt-3">
						<CustomTooltip text="Settings for including numbers and symbols in word-based passphrases." position="top">
							<button 
								type="button"
								on:click={() => numbersSymbolsOpen = !numbersSymbolsOpen}
								aria-expanded={numbersSymbolsOpen}
								aria-controls="word-numbers-symbols-content"
								class="w-full flex justify-between items-center text-left text-sm font-medium mb-2 p-2 rounded-t-md bg-slate-800 hover:bg-slate-700 border-b border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
							>
								<span class="text-gray-200">Numbers & Symbols</span>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transform transition-transform duration-200 text-gray-400 {numbersSymbolsOpen ? 'rotate-0' : '-rotate-90'}">
									<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
								</svg>
							</button>
						</CustomTooltip>
						{#if numbersSymbolsOpen}
							<div id="word-numbers-symbols-content" class="space-y-4 pt-3 pb-1 px-1" transition:slide={{ duration: 200 }}>
								<!-- Number of Digits Input -->
								<CustomTooltip text="How many digits to include (0-5). 0 means no digits." position="top">
									<div class="pl-0">
										<label for="numDigitsWordInput" class="mb-1 block text-sm font-medium text-gray-300">Number of Digits (0-5): <span class="font-bold text-green-400">{numDigitsForWordMode}</span></label>
										<input type="number" id="numDigitsWordInput" bind:value={numDigits} min="0" max="5" class="block w-20 rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500" />
									</div>
								</CustomTooltip>
								
								<!-- Number of Symbols Input -->
								<CustomTooltip text="How many symbols to include (0-5). 0 means no symbols." position="left">
									<div class="pl-0 mt-3">
										<label for="numSymbolsWordInput" class="mb-1 block text-sm font-medium text-gray-300">Number of Symbols (0-5): <span class="font-bold text-green-400">{numSymbolsForWordMode}</span></label>
										<div class="flex items-center">
											<input type="number" id="numSymbolsWordInput" bind:value={numSymbols} min="0" max="5" class="block w-20 rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500" />
											{#if numSymbolsForWordMode > 0}
												<CustomTooltip text="Customize which symbols are used for word-based passphrases." position="right">
													<button type="button" on:click={() => openSymbolModal('words')} class="cursor-pointer ml-3 p-1 text-xl text-slate-400 hover:text-slate-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 rounded-md flex items-center justify-center transition-all duration-150 ease-in-out" title="Customize Symbols">
														⚙️
													</button>
												</CustomTooltip>
											{/if}
										</div>
									</div>
								</CustomTooltip>

								{#if numDigitsForWordMode > 0 || numSymbolsForWordMode > 0}
									<CustomTooltip text="Where to place the numbers and/or symbols relative to the words." position="top">
										<div class="mt-4">
											<label class="block text-sm font-medium text-gray-300 mb-1">Number/Symbol Position</label>
											<!-- Radio buttons for numSymPosition -->
											<div class="flex flex-col gap-2 pl-2">
												<CustomTooltip text="Add numbers/symbols at the end of the passphrase." position="bottom">
													<label class="flex items-center gap-x-2 cursor-pointer">
														<input type="radio" bind:group={numSymPosition} name="numSymPositionWord" value="append" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
														<span class="text-sm text-gray-300 select-none hover:text-gray-100">Append (default)</span>
													</label>
												</CustomTooltip>
												<CustomTooltip text="Add numbers/symbols at the beginning of the passphrase." position="bottom">
													<label class="flex items-center gap-x-2 cursor-pointer">
														<input type="radio" bind:group={numSymPosition} name="numSymPositionWord" value="prepend" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
														<span class="text-sm text-gray-300 select-none hover:text-gray-100">Prepend</span>
													</label>
												</CustomTooltip>
												<CustomTooltip text="Places numbers/symbols at random positions between words. If grouped separately, number block and symbol block are placed independently." position="bottom">
													<label class="flex items-center gap-x-2 cursor-pointer">
														<input type="radio" bind:group={numSymPosition} name="numSymPositionWord" value="interspersed" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
														<span class="text-sm text-gray-300 select-none hover:text-gray-100">Interspersed</span>
													</label>
												</CustomTooltip>
											</div>
										</div>
									</CustomTooltip>

									<CustomTooltip text="How numbers and symbols are grouped if both are included." position="top">
										<div class="mt-4">
											<label class="block text-sm font-medium text-gray-300 mb-1">Symbol/Number Grouping</label>
											<!-- Radio buttons for charGrouping -->
											<div class="flex flex-col gap-2 pl-2">
												<CustomTooltip text="Numbers and symbols are combined into a single block (e.g., 123#$%)" position="bottom">
													<label class="flex items-center gap-x-2 cursor-pointer">
														<input type="radio" bind:group={charGrouping} name="charGroupingWord" value="together" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
														<span class="text-sm text-gray-300 select-none hover:text-gray-100">Together (default)</span>
													</label>
												</CustomTooltip>
												<CustomTooltip text="If selected, number blocks and symbol blocks can be placed independently when 'Interspersed'. For 'Append'/'Prepend', they are added sequentially." position="bottom">
													<label class="flex items-center gap-x-2 cursor-pointer">
														<input type="radio" bind:group={charGrouping} name="charGroupingWord" value="separate" class="custom-radio focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" />
														<span class="text-sm text-gray-300 select-none hover:text-gray-100">Separate</span>
													</label>
												</CustomTooltip>
											</div>
										</div>
									</CustomTooltip>
								{/if}
							</div>
						{/if}
					</fieldset>
				</div>
			</div>
		{:else if generationMode === 'randomChars'}
			<!-- RANDOM CHARACTER OPTIONS -->
			<div class="space-y-6">
				<CustomTooltip text="Settings for random character passwords." position="top">
					<button 
						type="button"
						on:click={() => randomCharsOptionsOpen = !randomCharsOptionsOpen}
						aria-expanded={randomCharsOptionsOpen}
						aria-controls="random-chars-content"
						class="w-full flex justify-between items-center text-left text-sm font-medium mb-2 p-2 rounded-t-md bg-slate-800 hover:bg-slate-700 border-b border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
					>
						<span class="text-gray-200">Random Character Options</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transform transition-transform duration-200 text-gray-400 {randomCharsOptionsOpen ? 'rotate-0' : '-rotate-90'}">
							<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
						</svg>
					</button>
				</CustomTooltip>

				{#if randomCharsOptionsOpen}
				<div id="random-chars-content" class="space-y-6 pt-3 pb-1 px-1 md:px-3" transition:slide={{ duration: 200 }}>
					<!-- Password Length Slider -->
					<div class="w-full">
						<!-- <CustomTooltip text="Total length of the random password (8-128 characters)." position="top"> -->
						<div class="space-y-2">
							<label for="randomPasswordLengthSlider" class="block text-sm font-medium text-gray-300">Password Length: <span class="font-bold text-green-400">{randomPasswordLength}</span></label>
							<input type="range" id="randomPasswordLengthSlider" name="randomPasswordLengthSlider" min="8" max="128" step="1" bind:value={randomPasswordLength} style="--slider-fill-percent: {randomSliderFillPercent}%" class="custom-slider w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 mt-1" />
						</div>
						<!-- </CustomTooltip> -->
					</div>

					<!-- Character Type Checkboxes -->
					<fieldset aria-labelledby="randomCharTypesLegend">
						<legend id="randomCharTypesLegend" class="block text-sm font-medium text-gray-300 mb-2">Include Character Types:</legend>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
							<CustomTooltip text="Include lowercase letters (a-z)." position="top">
								<label class="flex items-center gap-x-3 cursor-pointer">
									<input type="checkbox" bind:checked={randomIncludeLowercase} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
									<span class="text-sm text-gray-300 select-none hover:text-gray-100">Lowercase (a-z)</span>
								</label>
							</CustomTooltip>
							<CustomTooltip text="Include uppercase letters (A-Z)." position="top">
								<label class="flex items-center gap-x-3 cursor-pointer">
									<input type="checkbox" bind:checked={randomIncludeUppercase} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
									<span class="text-sm text-gray-300 select-none hover:text-gray-100">Uppercase (A-Z)</span>
								</label>
							</CustomTooltip>
							<CustomTooltip text="Include numbers (0-9)." position="top">
								<label class="flex items-center gap-x-3 cursor-pointer">
									<input type="checkbox" bind:checked={randomIncludeNumbers} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
									<span class="text-sm text-gray-300 select-none hover:text-gray-100">Numbers (0-9)</span>
								</label>
							</CustomTooltip>
							<div> 
								<CustomTooltip text="Include symbols (e.g., !@#$%)." position="top">
									<label class="flex items-center gap-x-3 cursor-pointer">
										<input type="checkbox" bind:checked={randomIncludeSymbols} class="custom-checkbox focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800" style={`--checkmark-url: ${checkmarkDataUrl}`} />
										<span class="text-sm text-gray-300 select-none hover:text-gray-100">Symbols (!@#$)</span>
									</label>
								</CustomTooltip>
								{#if randomIncludeSymbols}
									<div class="flex items-center mt-1 pl-8"> 
										<CustomTooltip text="Customize which symbols are used for random passwords." position="right">
											<button type="button" on:click={() => openSymbolModal('randomChars')} class="cursor-pointer p-1 text-xl text-slate-400 hover:text-slate-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 rounded-md flex items-center justify-center transition-all duration-150 ease-in-out" title="Customize Symbols">
												⚙️
											</button>
										</CustomTooltip>
										<span class="text-xs text-slate-500 italic ml-1">({customSymbolsRandomMode.length} selected)</span>
									</div>
								{/if}
							</div>
						</div>
					</fieldset>
					{#if !randomIncludeLowercase && !randomIncludeUppercase && !randomIncludeNumbers && !randomIncludeSymbols}
						<p class="text-xs text-red-400 pt-2 px-1">Please select at least one character type.</p>
					{/if}
				</div>
				{/if}
			</div>
		{/if}

		<!-- Reset to Defaults Button -->
		<div class="mt-6 pt-6 border-t border-slate-700 text-center">
			<button 
				on:click={resetToDefaults}
				class="px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-100 border border-slate-600 rounded-md hover:border-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
				title="Reset all options to their original defaults"
			>
				Reset to Defaults
			</button>
		</div>

	</section>

	<SymbolSelectorModal 
		bind:isOpen={showSymbolModal} 
		availableSymbols={DEFAULT_PASSPHRASE_SYMBOLS} 
		selectedSymbols={editingSymbolSetFor === 'words' ? customSymbolsWordMode : customSymbolsRandomMode}
		on:save={handleSymbolSave} 
		on:close={() => showSymbolModal = false}
	/>

	<footer class="w-full max-w-2xl mx-auto text-center py-8 mt-2 border-t border-slate-700">
		<div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
			<a href="/terms" class="text-xs text-slate-400 hover:text-slate-200 transition-colors">Terms and Conditions</a>
			<a href="/privacy" class="text-xs text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</a>
			<a href="/contact" class="text-xs text-slate-400 hover:text-slate-200 transition-colors">Contact Us</a>
			<a href="/password-guide" class="text-xs text-slate-400 hover:text-slate-200 transition-colors">Password Guide</a>
			<a href="/donate" class="text-xs text-slate-400 hover:text-slate-200 transition-colors">Support Us</a>
		</div>
		<p class="text-xs text-slate-500">
			&copy; {currentYear} MemPhrase. All rights reserved.
		</p>
	</footer>

</main>
