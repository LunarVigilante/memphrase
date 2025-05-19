import { adjectives as generalAdjectives } from './adjectives';
import { animals } from './animals';
import { colors } from './colors';
// import { windowParts } from './windowParts'; // Removed
import { commonObjects } from './nouns'; // Changed from nouns
// import { verbs as oldVerbs } from './verbs'; // Will be replaced by actionVerbs
import { foods } from './foods'; // New import

// Import new lists
import { qualitiesTraits } from './qualitiesTraits';
import { sizesShapes } from './sizesShapes';
import { places } from './places';
import { conceptsIdeas } from './conceptsIdeas';
import { actionVerbs } from './actionVerbs'; // New primary verb list
import { stateVerbs } from './stateVerbs'; // New import

// Redefine WordCategory for nesting
export interface WordCategory {
  name: string;            // e.g., "Nouns" (parent) or "Animals" (child/leaf)
  words?: string[];         // Actual word list, only for leaf nodes
  subCategories?: WordCategory[]; // Nested categories for parents
  isParent?: boolean;       // True if this category is a parent
  // We won't store checked state here; Svelte component will manage UI state.
}

export const categories: WordCategory[] = [
  {
    name: 'Adjectives',
    isParent: true,
    subCategories: [
      { name: 'General Adjectives', words: generalAdjectives },
      { name: 'Colors', words: colors },
      { name: 'Qualities/Traits', words: qualitiesTraits },
      { name: 'Sizes/Shapes', words: sizesShapes }
    ]
  },
  {
    name: 'Nouns',
    isParent: true,
    subCategories: [
      { name: 'Animals', words: animals },
      { name: 'Common Objects', words: commonObjects },
      { name: 'Foods', words: foods },
      { name: 'Places', words: places },
      { name: 'Concepts/Ideas', words: conceptsIdeas }
    ]
  },
  {
    name: 'Verbs',
    isParent: true,
    subCategories: [
      { name: 'Action Verbs', words: actionVerbs },
      { name: 'State Verbs', words: stateVerbs }
    ]
  }
];

// Default selected leaf categories
export const defaultCategories = [
    'General Adjectives', 
    'Colors',
    'Animals',
    'Common Objects', 
    'Action Verbs'
];

// Helper function to get all leaf category names (useful for validation or other logic if needed)
export function getAllLeafCategoryNames(cats: WordCategory[] = categories): string[] {
  const leafNames: string[] = [];
  function recurse(items: WordCategory[]) {
    for (const item of items) {
      if (item.subCategories && item.subCategories.length > 0) {
        if (item.isParent) { // Only recurse if it's a parent with subs
            recurse(item.subCategories);
        }
      } else if (item.words) { 
        leafNames.push(item.name);
      }
    }
  }
  recurse(cats);
  return leafNames;
}

// Helper to get a specific category object by its name (can be parent or leaf)
export function getCategoryByName(name: string, catsToSearch: WordCategory[] = categories): WordCategory | undefined {
    for (const category of catsToSearch) {
        if (category.name === name) {
            return category;
        }
        if (category.subCategories) {
            const foundInSub = getCategoryByName(name, category.subCategories);
            if (foundInSub) return foundInSub;
        }
    }
    return undefined;
} 