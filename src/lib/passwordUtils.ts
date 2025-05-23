import { categories as allNestedCategories, type WordCategory, getCategoryByName } from './words';

// Helper function to get a random element from an array
function getRandomElement<T>(arr: T[]): T {
	if (!arr || arr.length === 0) {
		// console.warn('Attempted to get random element from empty or invalid array.');
		return '' as T; // Return empty string or handle appropriately
	}
	return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get multiple unique random elements from an array
function getRandomElements<T>(arr: T[], count: number): T[] {
	if (!arr || arr.length === 0) return [];
	if (count >= arr.length) return [...arr].sort(() => Math.random() - 0.5);
	
	const shuffled = [...arr].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export const DEFAULT_PASSPHRASE_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'; // Export for UI use

export interface PassphraseOptions {
	numWords: number;
	separator: string;
	capitalize: boolean;
	numDigits: number;
	numSymbols: number;
	selectedCategories: string[]; // Flat list of selected LEAF category names
	numSymPosition: 'append' | 'prepend' | 'interspersed';
	charGrouping?: 'together' | 'separate';

	// New options for generation mode
	generationMode: 'words' | 'randomChars';
	randomPasswordLength?: number;
	randomIncludeLowercase?: boolean;
	randomIncludeUppercase?: boolean;
	randomIncludeNumbers?: boolean; // Different from numDigits for word-based
	randomIncludeSymbols?: boolean; // Different from numSymbols for word-based
	customSymbols?: string[]; // New: For user-selected symbols
}

// Helper to get all words from a specific parent category type (e.g., 'Nouns')
// from the user's selected leaf categories.
function getWordsFromSelectedByType(parentCategoryName: 'Adjectives' | 'Nouns' | 'Verbs', selectedLeafCategories: string[]): string[] {
	const words: string[] = [];
	const parentCat = allNestedCategories.find(c => c.name === parentCategoryName);
	if (parentCat && parentCat.subCategories) {
		for (const subCat of parentCat.subCategories) {
			if (selectedLeafCategories.includes(subCat.name) && subCat.words) {
				words.push(...subCat.words);
			}
		}
	}
	return words;
}

// Enhanced word selection that prioritizes shorter, more common words for memorability
function getMemorableWord(words: string[]): string {
	if (!words || words.length === 0) return '';
	
	// Prefer shorter words (4-7 characters) as they're easier to remember
	const shorterWords = words.filter(word => word.length >= 3 && word.length <= 7);
	const wordPool = shorterWords.length > 0 ? shorterWords : words;
	
	return getRandomElement(wordPool);
}

// Create memorable word patterns based on number of words
function generateMemorableWordPattern(numWords: number, selectedCategories: string[]): string[] {
	const adjectives = getWordsFromSelectedByType('Adjectives', selectedCategories);
	const nouns = getWordsFromSelectedByType('Nouns', selectedCategories);
	const verbs = getWordsFromSelectedByType('Verbs', selectedCategories);
	
	const wordsArr: string[] = [];
	
	switch (numWords) {
		case 1:
			// Single word: prefer a descriptive noun or adjective
			if (nouns.length > 0) {
				wordsArr.push(getMemorableWord(nouns));
			} else if (adjectives.length > 0) {
				wordsArr.push(getMemorableWord(adjectives));
			} else if (verbs.length > 0) {
				wordsArr.push(getMemorableWord(verbs));
			}
			break;
			
		case 2:
			// Two words: Adjective + Noun pattern (like "RedCar" or "FastDog")
			if (adjectives.length > 0 && nouns.length > 0) {
				wordsArr.push(getMemorableWord(adjectives));
				wordsArr.push(getMemorableWord(nouns));
			} else {
				// Fallback to any two words from available categories
				const allAvailable = [...adjectives, ...nouns, ...verbs];
				const selected = getRandomElements(allAvailable, 2);
				wordsArr.push(...selected);
			}
			break;
			
		case 3:
			// Three words: Adjective + Adjective + Noun or Adjective + Noun + Verb
			if (adjectives.length > 0 && nouns.length > 0) {
				if (verbs.length > 0 && Math.random() > 0.5) {
					// Pattern: Adjective + Noun + Verb (like "BigDogRuns")
					wordsArr.push(getMemorableWord(adjectives));
					wordsArr.push(getMemorableWord(nouns));
					wordsArr.push(getMemorableWord(verbs));
				} else {
					// Pattern: Adjective + Adjective + Noun (like "BigRedCar")
					const twoAdjectives = getRandomElements(adjectives, 2);
					wordsArr.push(...twoAdjectives);
					wordsArr.push(getMemorableWord(nouns));
				}
			} else {
				// Fallback to diverse selection
				const allAvailable = [...adjectives, ...nouns, ...verbs];
				const selected = getRandomElements(allAvailable, 3);
				wordsArr.push(...selected);
			}
			break;
			
		case 4:
			// Four words: Adjective + Adjective + Noun + Verb pattern
			if (adjectives.length > 0 && nouns.length > 0 && verbs.length > 0) {
				const twoAdjectives = getRandomElements(adjectives, 2);
				wordsArr.push(...twoAdjectives);
				wordsArr.push(getMemorableWord(nouns));
				wordsArr.push(getMemorableWord(verbs));
			} else {
				// Fallback: try to get at least one from each available category
				const patterns = [];
				if (adjectives.length > 0) patterns.push(() => getMemorableWord(adjectives));
				if (nouns.length > 0) patterns.push(() => getMemorableWord(nouns));
				if (verbs.length > 0) patterns.push(() => getMemorableWord(verbs));
				
				// Fill remaining slots by repeating patterns
				while (wordsArr.length < numWords && patterns.length > 0) {
					const patternIndex = wordsArr.length % patterns.length;
					wordsArr.push(patterns[patternIndex]());
				}
			}
			break;
			
		default:
			// For 5+ words: create a more complex but memorable pattern
			if (adjectives.length > 0 && nouns.length > 0 && verbs.length > 0) {
				// Pattern: Multiple adjectives + nouns + verbs in a logical sequence
				const numAdj = Math.min(Math.ceil(numWords * 0.4), adjectives.length);
				const numNoun = Math.min(Math.ceil(numWords * 0.4), nouns.length);
				const numVerb = Math.min(numWords - numAdj - numNoun, verbs.length);
				
				wordsArr.push(...getRandomElements(adjectives, numAdj));
				wordsArr.push(...getRandomElements(nouns, numNoun));
				wordsArr.push(...getRandomElements(verbs, numVerb));
				
				// Fill any remaining slots
				while (wordsArr.length < numWords) {
					const allRemaining = [...adjectives, ...nouns, ...verbs];
					const remaining = allRemaining.filter(word => !wordsArr.includes(word));
					if (remaining.length > 0) {
						wordsArr.push(getMemorableWord(remaining));
					} else {
						// If we've used all unique words, start reusing
						wordsArr.push(getMemorableWord([...adjectives, ...nouns, ...verbs]));
					}
				}
			} else {
				// Fallback to original random selection for edge cases
				return []; // Will trigger fallback in main function
			}
			break;
	}
	
	return wordsArr;
}

export function generatePassphraseService(options: PassphraseOptions): string {
	const { 
		generationMode = 'words', // Default to words if not provided
		randomPasswordLength = 16, // Default length for random
		randomIncludeLowercase = true,
		randomIncludeUppercase = true,
		randomIncludeNumbers = true,
		randomIncludeSymbols = true,
		customSymbols // New
	} = options;

	const currentSymbolsToUse = (customSymbols && customSymbols.length > 0) ? customSymbols.join('') : DEFAULT_PASSPHRASE_SYMBOLS;

	if (generationMode === 'randomChars') {
		let charPool = '';
		const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
		const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numberChars = '0123456789';

		if (randomIncludeLowercase) charPool += lowercaseChars;
		if (randomIncludeUppercase) charPool += uppercaseChars;
		if (randomIncludeNumbers) charPool += numberChars;
		if (randomIncludeSymbols) charPool += currentSymbolsToUse; // Use selected or default

		if (charPool === '' || randomPasswordLength === 0) {
			return 'Error: No character types selected or length is zero for random password.';
		}

		let randomPassword = '';
		for (let i = 0; i < randomPasswordLength; i++) {
			randomPassword += charPool[Math.floor(Math.random() * charPool.length)];
		}
		// Basic shuffle to improve distribution, especially if we were to enforce one of each type
		randomPassword = randomPassword.split('').sort(() => 0.5 - Math.random()).join('');
		return randomPassword;
	}

	// Existing word-based generation logic starts here
	const { 
		numWords, 
		separator, 
		capitalize, 
		numDigits,
		numSymbols,
		selectedCategories, 
		numSymPosition,
		charGrouping = 'together'
	} = options;
	
	const wordsArr: string[] = [];

	if (numWords > 0 && selectedCategories.length === 0) {
		return 'Error: No word categories selected for generation.'; // Updated error message
	}

	if (numWords > 0) {
		// Try the new memorable word pattern generation first
		const memorableWords = generateMemorableWordPattern(numWords, selectedCategories);
		
		if (memorableWords.length > 0) {
			// Apply capitalization to the memorable words
			for (let word of memorableWords) {
				if (capitalize) {
					word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
				} else {
					word = word.toLowerCase();
				}
				wordsArr.push(word);
			}
		} else {
			// Fallback to original logic if memorable pattern fails
			const activeCategoriesObjects: WordCategory[] = [];
			for (const name of selectedCategories) {
				const category = getCategoryByName(name, allNestedCategories);
				if (category && category.words) { activeCategoriesObjects.push(category); }
			}
			if (activeCategoriesObjects.length === 0) return 'Error: Selected categories have no words.';

			const shuffledActiveCategoriesForWordPicking = [...activeCategoriesObjects].sort(() => Math.random() - 0.5);
			const numToGuaranteeForWordPicking = Math.min(numWords, shuffledActiveCategoriesForWordPicking.length);
			for (let i = 0; i < numToGuaranteeForWordPicking; i++) {
				const cat = shuffledActiveCategoriesForWordPicking[i];
				let word = getRandomElement(cat.words!);
				if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); else word = word.toLowerCase();
				wordsArr.push(word);
			}
			if (numWords > numToGuaranteeForWordPicking) {
				for (let i = numToGuaranteeForWordPicking; i < numWords; i++) {
					const catIdx = (i - numToGuaranteeForWordPicking) % activeCategoriesObjects.length;
					const cat = activeCategoriesObjects[catIdx];
					let word = getRandomElement(cat.words!);
					if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); else word = word.toLowerCase();
					wordsArr.push(word);
				}
			}
			// Shuffle the entire wordsArr for fallback cases
			for (let i = wordsArr.length - 1; i > 0; i--) { 
				const j = Math.floor(Math.random() * (i + 1));
				[wordsArr[i], wordsArr[j]] = [wordsArr[j], wordsArr[i]];
			}
		}
	}

	let numPart = '';
	let symPart = '';

	// Generate numbers, avoiding separator if it's a single digit
	if (numDigits > 0) {
		const isSeparatorSingleDigit = separator.length === 1 && /\d/.test(separator);
		for (let i = 0; i < numDigits; i++) {
			let randomDigit;
			do {
				randomDigit = Math.floor(Math.random() * 10).toString();
			} while (isSeparatorSingleDigit && randomDigit === separator);
			numPart += randomDigit;
		}
	}

	// Generate symbols, avoiding separator if it's one of the symbols
	if (numSymbols > 0) {
		const symbolsArrayForWordMode = currentSymbolsToUse.split(''); // Use selected or default for word mode too
		let availableSymbols = symbolsArrayForWordMode;
		if (separator.length === 1 && currentSymbolsToUse.includes(separator)) {
			availableSymbols = symbolsArrayForWordMode.filter(s => s !== separator);
		}
		if (availableSymbols.length > 0) { 
			for (let i = 0; i < numSymbols; i++) {
				symPart += getRandomElement(availableSymbols);
			}
		} 
	}

	if (charGrouping === 'separate') {
		const elementsToPlace = [];
		if (numPart) elementsToPlace.push(numPart);
		if (symPart) elementsToPlace.push(symPart);
		
		if (elementsToPlace.length > 1) {
			elementsToPlace.sort(() => Math.random() - 0.5); // Randomize order of num & sym parts
		}

		const corePassphrase = wordsArr.join(separator);

		if (elementsToPlace.length === 0) {
			return corePassphrase || ''; 
		}

		if (numSymPosition === 'interspersed') {
			const tempWordsArr = [...wordsArr];
			if (tempWordsArr.length === 0) { 
				return elementsToPlace.join(separator);
			}
			for (const item of elementsToPlace) {
				const randomIndex = Math.floor(Math.random() * (tempWordsArr.length + 1));
				tempWordsArr.splice(randomIndex, 0, item);
			}
			return tempWordsArr.join(separator);
		} else if (numSymPosition === 'append') {
            if (wordsArr.length === 0) {
                return elementsToPlace.join(separator);
            }
            let finalPassphrase = corePassphrase;
            for (const item of elementsToPlace) {
                finalPassphrase += separator + item;
            }
            return finalPassphrase;
		} else { // prepend
			let prefix = '';
            for (let i = 0; i < elementsToPlace.length; i++) {
                prefix += elementsToPlace[i];
                if (i < elementsToPlace.length - 1) { 
                    prefix += separator;
                }
            }
			const core = wordsArr.join(separator); // Re-join in case wordsArr was empty initially for corePassphrase
			if (prefix && core) {
				return prefix + separator + core;
			} else if (prefix) {
				return prefix;
			}
			return core || ''; 
		}
	} else { // charGrouping === 'together'
		const combinedExtraChars = numPart + symPart;
		const core = wordsArr.join(separator);
		if (combinedExtraChars.length === 0) {
            return core || '';
        }

		if (numSymPosition === 'prepend') {
			return combinedExtraChars + core;
		} else if (numSymPosition === 'append') {
			return core + combinedExtraChars;
		} else { // interspersed for 'together' grouping
			const tempWordsArr = [...wordsArr];
			if (tempWordsArr.length === 0 && combinedExtraChars.length > 0) return combinedExtraChars; 
            if (tempWordsArr.length === 0 && combinedExtraChars.length === 0) return '';
            
            if (combinedExtraChars.length > 0) { 
                const randomIndex = Math.floor(Math.random() * (tempWordsArr.length + 1));
                tempWordsArr.splice(randomIndex, 0, combinedExtraChars);
            }
            return tempWordsArr.join(separator);
		}
	}
}

export interface PassphraseStrengthResult {
	score: number; 
	label: string;
	colorClass: string;
	entropy: number;
	wordPattern?: string; // New field to show the pattern used
}

const wordListSizes = { // This will be used again for word-based entropy
	'General Adjectives': 25,
	'Colors': 19,
	'Qualities/Traits': 21,
	'Sizes/Shapes': 24,
	'Animals': 26,
	'Common Objects': 33,
	'Foods': 33, 
	'Places': 35,
	'Concepts/Ideas': 64,
	'Action Verbs': 64,
	'State Verbs': 14
};

export function calculatePassphraseStrength(
	passphrase: string, // passphrase string itself is now less directly used for entropy calculation, mostly for error/invalid checks
	opts: PassphraseOptions
): PassphraseStrengthResult {
	let totalEntropy = 0;

	if (passphrase.startsWith('Error:') || passphrase.startsWith('Invalid Options')) {
        return { score: 0, label: '-', colorClass: 'text-red-400', entropy: 0 };
    }

	if (opts.generationMode === 'randomChars') {
		let poolSize = 0;
		if (opts.randomIncludeLowercase) poolSize += 26;
		if (opts.randomIncludeUppercase) poolSize += 26;
		if (opts.randomIncludeNumbers) poolSize += 10;
		if (opts.randomIncludeSymbols) {
			poolSize += (opts.customSymbols && opts.customSymbols.length > 0) ? opts.customSymbols.length : DEFAULT_PASSPHRASE_SYMBOLS.length;
		}

		if (poolSize > 0 && opts.randomPasswordLength && opts.randomPasswordLength > 0) {
			totalEntropy = opts.randomPasswordLength * Math.log2(poolSize);
		} else {
			totalEntropy = 0;
		}
	} else { // Word-based calculation
		// 1. Word Entropy
		if (opts.numWords > 0 && opts.selectedCategories && opts.selectedCategories.length > 0) {
			// Estimate average pool size from selected categories for simplicity, or use a fixed large N if many diverse are selected.
			// A more precise way would be to get the union of all words in selectedCategories.
			// For now, let's use an approximation based on the number of selected categories and their typical sizes.
			let effectiveWordPool = 0;
			const uniqueWordsInSelectedCategories = new Set<string>();
			opts.selectedCategories.forEach(catName => {
				const category = getCategoryByName(catName, allNestedCategories);
				if (category && category.words) {
					category.words.forEach(word => uniqueWordsInSelectedCategories.add(word));
				}
			});
			effectiveWordPool = uniqueWordsInSelectedCategories.size;

			if (effectiveWordPool > 1) { 
				totalEntropy += opts.numWords * Math.log2(effectiveWordPool);
			}
		}

		// 2. Capitalization Entropy
		if (opts.capitalize && opts.numWords > 0) {
			totalEntropy += opts.numWords; // Each word offers 2 choices (cap or no cap), so 1 bit per word
		}

		// 3. Digit Entropy (for word-based)
		if (opts.numDigits && opts.numDigits > 0) {
			totalEntropy += opts.numDigits * Math.log2(10);
		}

		// 4. Symbol Entropy (for word-based)
		if (opts.numSymbols && opts.numSymbols > 0) {
			const symbolsToConsider = (opts.customSymbols && opts.customSymbols.length > 0) ? opts.customSymbols : DEFAULT_PASSPHRASE_SYMBOLS.split('');
			if (symbolsToConsider.length > 0) {
				totalEntropy += opts.numSymbols * Math.log2(symbolsToConsider.length);
			}
		}
	}

	// Determine normalizedScore based on entropy thresholds
	let normalizedScore = 0;
	if (totalEntropy < 15)      normalizedScore = 0; // Very Weak
	else if (totalEntropy < 22) normalizedScore = 1; // Weak 
	else if (totalEntropy < 35) normalizedScore = 2; // Medium
	else if (totalEntropy < 50) normalizedScore = 3; // Strong
	else                         normalizedScore = 4; // Very Strong

	const strengthLevels: Array<{ label: string; colorClass: string }> = [
		{ label: 'Very Weak', colorClass: 'text-red-500' },
		{ label: 'Weak', colorClass: 'text-orange-500' },
		{ label: 'Medium', colorClass: 'text-yellow-500' },
		{ label: 'Strong', colorClass: 'text-green-500' },
		{ label: 'Very Strong', colorClass: 'text-emerald-500' }
	];
    
	const level = strengthLevels[normalizedScore];

	return {
		score: normalizedScore,
		label: level.label,
		colorClass: level.colorClass,
		entropy: parseFloat(totalEntropy.toFixed(1))
	};
}

// Function to describe the word pattern being used for user education
export function describeWordPattern(numWords: number, selectedCategories: string[]): string {
	const adjectives = getWordsFromSelectedByType('Adjectives', selectedCategories);
	const nouns = getWordsFromSelectedByType('Nouns', selectedCategories);
	const verbs = getWordsFromSelectedByType('Verbs', selectedCategories);
	
	if (selectedCategories.length === 0) return '';
	
	switch (numWords) {
		case 1:
			if (nouns.length > 0) return 'Single descriptive word';
			return 'Single word';
		case 2:
			if (adjectives.length > 0 && nouns.length > 0) {
				return 'Adjective + Noun (e.g., "RedCar")';
			}
			return 'Two related words';
		case 3:
			if (adjectives.length > 0 && nouns.length > 0 && verbs.length > 0) {
				return 'Adjective + Noun + Verb (e.g., "BigDogRuns")';
			} else if (adjectives.length > 0 && nouns.length > 0) {
				return 'Adjective + Adjective + Noun (e.g., "BigRedCar")';
			}
			return 'Three related words';
		case 4:
			if (adjectives.length > 0 && nouns.length > 0 && verbs.length > 0) {
				return 'Adjective + Adjective + Noun + Verb';
			}
			return 'Four diverse words';
		default:
			if (numWords >= 5) {
				return `${numWords} words in logical patterns`;
			}
			return `${numWords} words`;
	}
} 