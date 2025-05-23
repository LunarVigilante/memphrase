// Lazy loading system for word lists
import { browser } from '$app/environment';

// Cache for loaded word lists
const wordListCache = new Map<string, string[]>();

// Dynamic imports for each word category (matching actual file structure)
const wordListImports = {
	'General Adjectives': () => import('./adjectives').then(m => m.adjectives),
	'Animals': () => import('./animals').then(m => m.animals),
	'Action Verbs': () => import('./actionVerbs').then(m => m.actionVerbs),
	'State Verbs': () => import('./stateVerbs').then(m => m.stateVerbs),
	'Common Objects': () => import('./nouns').then(m => m.commonObjects),
	'Qualities/Traits': () => import('./qualitiesTraits').then(m => m.qualitiesTraits),
	'Concepts/Ideas': () => import('./conceptsIdeas').then(m => m.conceptsIdeas),
	'Foods': () => import('./foods').then(m => m.foods),
	'Colors': () => import('./colors').then(m => m.colors),
	'Places': () => import('./places').then(m => m.places),
	'Sizes/Shapes': () => import('./sizesShapes').then(m => m.sizesShapes),
	'Technology': () => import('./technology').then(m => m.technology),
	'Nature': () => import('./nature').then(m => m.nature),
	'Emotions': () => import('./emotions').then(m => m.emotions),
	'Occupations': () => import('./occupations').then(m => m.occupations),
	'Transportation': () => import('./transportation').then(m => m.transportation)
} as const;

// Loading states for each category
const loadingStates = new Map<string, Promise<string[]>>();

/**
 * Lazily load a word list by category name
 */
export async function loadWordList(categoryName: string): Promise<string[]> {
	if (!browser) {
		// During SSR, return empty array (words will load on client)
		return [];
	}

	// Return from cache if already loaded
	if (wordListCache.has(categoryName)) {
		return wordListCache.get(categoryName)!;
	}

	// Return existing promise if currently loading
	if (loadingStates.has(categoryName)) {
		return loadingStates.get(categoryName)!;
	}

	// Start loading
	const loadPromise = (async () => {
		try {
			const importFn = wordListImports[categoryName as keyof typeof wordListImports];
			if (!importFn) {
				console.warn(`Unknown word category: ${categoryName}`);
				return [];
			}

			const words = await importFn();
			wordListCache.set(categoryName, words);
			loadingStates.delete(categoryName);
			return words;
		} catch (error) {
			console.error(`Failed to load word list for ${categoryName}:`, error);
			loadingStates.delete(categoryName);
			return [];
		}
	})();

	loadingStates.set(categoryName, loadPromise);
	return loadPromise;
}

/**
 * Preload multiple word lists
 */
export async function preloadWordLists(categoryNames: string[]): Promise<void> {
	await Promise.all(categoryNames.map(name => loadWordList(name)));
}

/**
 * Check if a word list is currently loading
 */
export function isWordListLoading(categoryName: string): boolean {
	return loadingStates.has(categoryName);
}

/**
 * Check if a word list is loaded in cache
 */
export function isWordListLoaded(categoryName: string): boolean {
	return wordListCache.has(categoryName);
}

/**
 * Get loading progress (for UI feedback)
 */
export function getLoadingProgress(selectedCategories: string[]): {
	loaded: number;
	total: number;
	percentage: number;
} {
	const loaded = selectedCategories.filter(cat => isWordListLoaded(cat)).length;
	const total = selectedCategories.length;
	return {
		loaded,
		total,
		percentage: total > 0 ? Math.round((loaded / total) * 100) : 100
	};
} 