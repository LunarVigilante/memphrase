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
	parentCategoryName: 'Adjectives' | 'Nouns' | 'Verbs', 
	selectedCategories: string[]
): Promise<{
	words: string[];
	loadingProgress: { loaded: number; total: number; percentage: number };
}> {
	const cacheKey = `${parentCategoryName}_${selectedCategories.sort().join(',')}`;
	
	// Check cache first
	if (wordListResultCache.has(cacheKey)) {
		return {
			words: wordListResultCache.get(cacheKey)!,
			loadingProgress: getLoadingProgress(selectedCategories)
		};
	}
	
	const allWords: string[] = [];
	
	// Get categories that belong to the specified parent type
	for (const selectedCat of selectedCategories) {
		const category = getCategoryByName(selectedCat);
		if (!category || !category.words) continue;
		
		// Check if this category belongs to the parent type we're looking for
		let belongsToParent = false;
		
		if (parentCategoryName === 'Adjectives') {
			belongsToParent = selectedCat.includes('Adjectives') || 
							  selectedCat.includes('Colors') || 
							  selectedCat.includes('Qualities') || 
							  selectedCat.includes('Traits') || 
							  selectedCat.includes('Sizes') || 
							  selectedCat.includes('Shapes') ||
							  selectedCat.includes('Emotions');
		} else if (parentCategoryName === 'Nouns') {
			belongsToParent = selectedCat.includes('Animals') || 
							  selectedCat.includes('Objects') || 
							  selectedCat.includes('Foods') || 
							  selectedCat.includes('Places') || 
							  selectedCat.includes('Concepts') || 
							  selectedCat.includes('Ideas') ||
							  selectedCat.includes('Technology') ||
							  selectedCat.includes('Nature') ||
							  selectedCat.includes('Occupations') ||
							  selectedCat.includes('Transportation');
		} else if (parentCategoryName === 'Verbs') {
			belongsToParent = selectedCat.includes('Verbs');
		}
		
		if (belongsToParent) {
			try {
				const words = await loadWordList(selectedCat);
				allWords.push(...words);
			} catch (error) {
				console.warn(`Failed to load category ${selectedCat}:`, error);
			}
		}
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
			} else if (verbs.words.length > 0) {
				selectedWords.push(getMemorableWord(verbs.words));
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
					selectedWords.push(shuffled[0], shuffled[1]);
				}
			}
			break;
			
		case 3:
			// Three words: Adjective + Adjective + Noun pattern (matching main logic)
			if (adjectives.words.length >= 2 && nouns.words.length > 0) {
				// Get two different adjectives
				const firstAdj = getMemorableWord(adjectives.words);
				let secondAdj = getMemorableWord(adjectives.words);
				// Try to get a different adjective
				let attempts = 0;
				while (secondAdj === firstAdj && attempts < 5 && adjectives.words.length > 1) {
					secondAdj = getMemorableWord(adjectives.words);
					attempts++;
				}
				selectedWords.push(firstAdj, secondAdj, getMemorableWord(nouns.words));
			} else if (adjectives.words.length > 0 && nouns.words.length > 0 && verbs.words.length > 0) {
				// Fallback: Adjective + Noun + Verb pattern
				selectedWords.push(
					getMemorableWord(adjectives.words),
					getMemorableWord(nouns.words),
					getMemorableWord(verbs.words)
				);
			} else {
				// Final fallback to any available words
				const allAvailable = [...adjectives.words, ...nouns.words, ...verbs.words];
				if (allAvailable.length >= 3) {
					const shuffled = allAvailable.sort(() => Math.random() - 0.5);
					selectedWords.push(shuffled[0], shuffled[1], shuffled[2]);
				}
			}
			break;
			
		case 4:
			// Four words: Adjective + Adjective + Noun + Verb pattern
			if (adjectives.words.length >= 2 && nouns.words.length > 0 && verbs.words.length > 0) {
				const firstAdj = getMemorableWord(adjectives.words);
				let secondAdj = getMemorableWord(adjectives.words);
				// Try to get a different adjective
				let attempts = 0;
				while (secondAdj === firstAdj && attempts < 5 && adjectives.words.length > 1) {
					secondAdj = getMemorableWord(adjectives.words);
					attempts++;
				}
				selectedWords.push(firstAdj, secondAdj, getMemorableWord(nouns.words), getMemorableWord(verbs.words));
			} else {
				// Fallback: diverse selection
				const patterns = [];
				if (adjectives.words.length > 0) patterns.push(() => getMemorableWord(adjectives.words));
				if (nouns.words.length > 0) patterns.push(() => getMemorableWord(nouns.words));
				if (verbs.words.length > 0) patterns.push(() => getMemorableWord(verbs.words));
				
				for (let i = 0; i < numWords && patterns.length > 0; i++) {
					const patternIndex = i % patterns.length;
					selectedWords.push(patterns[patternIndex]());
				}
			}
			break;
			
		default:
			// For 5+ words, create a more complex but memorable pattern
			if (adjectives.words.length > 0 && nouns.words.length > 0 && verbs.words.length > 0) {
				const numAdj = Math.min(Math.ceil(numWords * 0.4), adjectives.words.length);
				const numNoun = Math.min(Math.ceil(numWords * 0.4), nouns.words.length);
				const numVerb = Math.min(numWords - numAdj - numNoun, verbs.words.length);
				
				// Add adjectives
				for (let i = 0; i < numAdj; i++) {
					selectedWords.push(getMemorableWord(adjectives.words));
				}
				// Add nouns
				for (let i = 0; i < numNoun; i++) {
					selectedWords.push(getMemorableWord(nouns.words));
				}
				// Add verbs
				for (let i = 0; i < numVerb; i++) {
					selectedWords.push(getMemorableWord(verbs.words));
				}
				
				// Fill remaining slots
				const allAvailable = [...adjectives.words, ...nouns.words, ...verbs.words];
				while (selectedWords.length < numWords && allAvailable.length > 0) {
					selectedWords.push(getMemorableWord(allAvailable));
				}
			} else {
				// Fallback to original pattern generation
				return { words: [], loadingProgress };
			}
			break;
	}
	
	// Don't shuffle - maintain the intended pattern order
	return {
		words: selectedWords.slice(0, numWords),
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