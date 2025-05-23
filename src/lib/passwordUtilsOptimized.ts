// Optimized password utilities with memoization and lazy loading
import { loadWordList, preloadWordLists, getLoadingProgress } from './words/lazy-loader';
import { getCategoryByName, type WordCategory } from './words';

// Memoization cache for expensive calculations
const memoCache = new Map<string, any>();

// Cache for word list results
const wordListResultCache = new Map<string, string[]>();

/**
 * Memoized function wrapper
 */
function memoize<T extends (...args: any[]) => any>(fn: T, keyFn?: (...args: Parameters<T>) => string): T {
	return ((...args: Parameters<T>) => {
		const key = keyFn ? keyFn(...args) : JSON.stringify(args);
		
		if (memoCache.has(key)) {
			return memoCache.get(key);
		}
		
		const result = fn(...args);
		memoCache.set(key, result);
		
		// Clean cache if it gets too large (prevent memory leaks)
		if (memoCache.size > 1000) {
			const oldestKey = memoCache.keys().next().value;
			if (oldestKey !== undefined) {
				memoCache.delete(oldestKey);
			}
		}
		
		return result;
	}) as T;
}

/**
 * Optimized entropy calculation with memoization
 */
const calculateEntropyMemoized = memoize((totalSymbols: number, length: number) => {
	if (totalSymbols <= 1 || length <= 0) return 0;
	return length * Math.log2(totalSymbols);
}, (totalSymbols, length) => `entropy_${totalSymbols}_${length}`);

/**
 * Efficiently get words from selected categories with lazy loading
 */
export async function getWordsFromSelectedByTypeOptimized(
	type: string, 
	selectedCategories: string[]
): Promise<{
	words: string[];
	loadingProgress: { loaded: number; total: number; percentage: number };
}> {
	const cacheKey = `${type}_${selectedCategories.sort().join(',')}`;
	
	// Check cache first
	if (wordListResultCache.has(cacheKey)) {
		return {
			words: wordListResultCache.get(cacheKey)!,
			loadingProgress: getLoadingProgress(selectedCategories)
		};
	}
	
	const allWords: string[] = [];
	const relevantCategories = selectedCategories.filter(cat => {
		const category = getCategoryByName(cat);
		return category && category.words;
	});
	
	// Load word lists in parallel
	const wordListPromises = relevantCategories.map(async categoryName => {
		try {
			return await loadWordList(categoryName);
		} catch (error) {
			console.warn(`Failed to load category ${categoryName}:`, error);
			return [];
		}
	});
	
	const wordLists = await Promise.all(wordListPromises);
	
	// Combine all words
	for (const words of wordLists) {
		allWords.push(...words);
	}
	
	// Remove duplicates efficiently
	const uniqueWords = [...new Set(allWords)];
	
	// Cache the result
	wordListResultCache.set(cacheKey, uniqueWords);
	
	return {
		words: uniqueWords,
		loadingProgress: getLoadingProgress(selectedCategories)
	};
}

/**
 * Optimized memorable word pattern generation
 */
export async function generateMemorableWordPatternOptimized(
	numWords: number, 
	selectedCategories: string[]
): Promise<{
	words: string[];
	loadingProgress: { loaded: number; total: number; percentage: number };
}> {
	if (numWords <= 0 || selectedCategories.length === 0) {
		return {
			words: [],
			loadingProgress: { loaded: 0, total: 0, percentage: 100 }
		};
	}
	
	// Preload commonly used categories for better UX
	const commonCategories = selectedCategories.filter(cat => 
		['General Adjectives', 'Animals', 'Common Objects', 'Colors'].includes(cat)
	);
	
	if (commonCategories.length > 0) {
		// Start preloading in background (don't await)
		preloadWordLists(commonCategories).catch(console.warn);
	}
	
	// Get word lists by type
	const [adjectives, nouns, verbs] = await Promise.all([
		getWordsFromSelectedByTypeOptimized('Adjectives', selectedCategories),
		getWordsFromSelectedByTypeOptimized('Nouns', selectedCategories),
		getWordsFromSelectedByTypeOptimized('Verbs', selectedCategories)
	]);
	
	// Use the loading progress from the most complete category
	const loadingProgress = adjectives.loadingProgress;
	
	// Optimized word selection with priority for shorter words
	const getMemorableWord = (words: string[]): string => {
		if (words.length === 0) return '';
		
		// Prefer words between 3-7 characters for memorability
		const memorableWords = words.filter(word => word.length >= 3 && word.length <= 7);
		const wordsToUse = memorableWords.length > 0 ? memorableWords : words;
		
		return wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
	};
	
	const selectedWords: string[] = [];
	
	// Generate pattern based on available word types and count
	switch (numWords) {
		case 1:
			if (nouns.words.length > 0) {
				selectedWords.push(getMemorableWord(nouns.words));
			} else if (adjectives.words.length > 0) {
				selectedWords.push(getMemorableWord(adjectives.words));
			}
			break;
			
		case 2:
			if (adjectives.words.length > 0 && nouns.words.length > 0) {
				selectedWords.push(
					getMemorableWord(adjectives.words),
					getMemorableWord(nouns.words)
				);
			} else {
				// Fallback to any available words
				const allAvailable = [...adjectives.words, ...nouns.words, ...verbs.words];
				if (allAvailable.length >= 2) {
					const shuffled = allAvailable.sort(() => Math.random() - 0.5);
					selectedWords.push(getMemorableWord(shuffled.slice(0, 2)));
				}
			}
			break;
			
		case 3:
			if (adjectives.words.length > 0 && nouns.words.length > 0 && verbs.words.length > 0) {
				selectedWords.push(
					getMemorableWord(adjectives.words),
					getMemorableWord(nouns.words),
					getMemorableWord(verbs.words)
				);
			} else if (adjectives.words.length > 0 && nouns.words.length >= 2) {
				selectedWords.push(
					getMemorableWord(adjectives.words),
					getMemorableWord(nouns.words),
					getMemorableWord(nouns.words)
				);
			}
			break;
			
		default:
			// For 4+ words, create a more complex pattern
			const targetCounts = {
				adjectives: Math.max(1, Math.floor(numWords * 0.4)),
				nouns: Math.max(1, Math.floor(numWords * 0.4)),
				verbs: Math.max(1, numWords - Math.floor(numWords * 0.8))
			};
			
			// Add words based on target counts
			for (let i = 0; i < targetCounts.adjectives && adjectives.words.length > 0; i++) {
				selectedWords.push(getMemorableWord(adjectives.words));
			}
			for (let i = 0; i < targetCounts.nouns && nouns.words.length > 0; i++) {
				selectedWords.push(getMemorableWord(nouns.words));
			}
			for (let i = 0; i < targetCounts.verbs && verbs.words.length > 0; i++) {
				selectedWords.push(getMemorableWord(verbs.words));
			}
			
			// Fill remaining slots with any available words
			const allAvailable = [...adjectives.words, ...nouns.words, ...verbs.words];
			while (selectedWords.length < numWords && allAvailable.length > 0) {
				selectedWords.push(getMemorableWord(allAvailable));
			}
			break;
	}
	
	// Shuffle for better randomness while maintaining patterns
	const shuffledWords = selectedWords.sort(() => Math.random() - 0.5);
	
	return {
		words: shuffledWords.slice(0, numWords),
		loadingProgress
	};
}

/**
 * Optimized strength calculation with memoization
 */
export interface OptimizedStrengthResult {
	score: number;
	label: string;
	colorClass: string;
	entropy: number;
	loadingProgress?: { loaded: number; total: number; percentage: number };
}

export const calculatePassphraseStrengthOptimized = memoize((
	passphrase: string,
	hasDigits: boolean,
	hasSymbols: boolean,
	hasLowercase: boolean,
	hasUppercase: boolean
): OptimizedStrengthResult => {
	if (!passphrase || passphrase.length === 0) {
		return {
			score: 0,
			label: 'None',
			colorClass: 'text-gray-400',
			entropy: 0
		};
	}
	
	// Character-based entropy calculation - analyze the actual passphrase
	let charSpace = 0;
	const actualHasLowercase = /[a-z]/.test(passphrase);
	const actualHasUppercase = /[A-Z]/.test(passphrase);
	const actualHasDigits = /[0-9]/.test(passphrase);
	const actualHasSymbols = /[^a-zA-Z0-9]/.test(passphrase);
	
	if (actualHasLowercase) charSpace += 26;
	if (actualHasUppercase) charSpace += 26;
	if (actualHasDigits) charSpace += 10;
	if (actualHasSymbols) {
		// Count unique symbols in the passphrase for more accurate calculation
		const symbolsInPassphrase = passphrase.match(/[^a-zA-Z0-9]/g) || [];
		const uniqueSymbols = new Set(symbolsInPassphrase);
		charSpace += Math.max(uniqueSymbols.size, 10); // Minimum 10 for typical symbol space
	}
	
	// Calculate entropy efficiently
	const entropy = calculateEntropyMemoized(charSpace, passphrase.length);
	
	// Determine strength level with improved thresholds (matching main calculation)
	let score = 0;
	let label = 'Very Weak';
	let colorClass = 'text-red-500';
	
	if (entropy >= 80) {
		score = 4; label = 'Very Strong'; colorClass = 'text-emerald-500';
	} else if (entropy >= 60) {
		score = 3; label = 'Strong'; colorClass = 'text-green-500';
	} else if (entropy >= 40) {
		score = 2; label = 'Medium'; colorClass = 'text-yellow-500';
	} else if (entropy >= 25) {
		score = 1; label = 'Weak'; colorClass = 'text-orange-500';
	}
	
	return {
		score,
		label,
		colorClass,
		entropy: parseFloat(entropy.toFixed(1))
	};
}, (passphrase, hasDigits, hasSymbols, hasLowercase, hasUppercase) => 
	`strength_${passphrase.length}_${hasDigits}_${hasSymbols}_${hasLowercase}_${hasUppercase}`
);

/**
 * Clear memoization caches (useful for testing or memory management)
 */
export function clearOptimizationCaches(): void {
	memoCache.clear();
	wordListResultCache.clear();
} 