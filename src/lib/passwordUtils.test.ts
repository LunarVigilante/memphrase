import { describe, it, expect } from 'vitest';
import { generatePassphraseService, type PassphraseOptions } from './passwordUtils';
import { categories, defaultCategories } from './words';

describe('generatePassphraseService', () => {
	it('should generate the correct number of words using selected categories', () => {
		const options: PassphraseOptions = {
			numWords: 4,
			separator: '-',
			capitalize: false,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: ['Adjectives', 'Animals']
		};
		const passphrase = generatePassphraseService(options);
		// Basic check: split by separator (ignoring potential number/symbol at the end for word count)
		const corePassphrase = passphrase.replace(/\d*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]*$/, '');
		expect(corePassphrase.split(options.separator)).toHaveLength(options.numWords);
	});

	it('should use the specified separator', () => {
		const options: PassphraseOptions = {
			numWords: 3,
			separator: '.',
			capitalize: false,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: defaultCategories
		};
		const passphrase = generatePassphraseService(options);
		expect(passphrase).toContain(options.separator);
		// Check actual word segments if separator is complex or could be part of a word
	});

	it('should capitalize words when specified', () => {
		const options: PassphraseOptions = {
			numWords: 2,
			separator: '-',
			capitalize: true,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: ['Colors', 'Animals']
		};
		const passphrase = generatePassphraseService(options);
		const words = passphrase.split(options.separator);
		words.forEach(word => {
			if (word) expect(word).toMatch(/^[A-Z][a-z]*$/);
		});
	});

	it('should not capitalize words when not specified', () => {
		const options: PassphraseOptions = {
			numWords: 2,
			separator: '-',
			capitalize: false,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: ['Colors', 'Animals']
		};
		const passphrase = generatePassphraseService(options);
		const words = passphrase.split(options.separator);
		words.forEach(word => {
			if (word) expect(word).toMatch(/^[a-z]+$/);
		});
	});

	it('should include a number at the end when specified', () => {
		const options: PassphraseOptions = {
			numWords: 2,
			separator: '-',
			capitalize: false,
			includeNumber: true,
			includeSymbol: false,
			selectedCategories: defaultCategories
		};
		const passphrase = generatePassphraseService(options);
		expect(passphrase).toMatch(/\d+$/);
	});

	it('should include a symbol at the end when specified', () => {
		const options: PassphraseOptions = {
			numWords: 2,
			separator: '-',
			capitalize: false,
			includeNumber: false,
			includeSymbol: true,
			selectedCategories: defaultCategories
		};
		const passphrase = generatePassphraseService(options);
		expect(passphrase).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]$/);
	});

	it('should include both number and symbol when specified', () => {
		const options: PassphraseOptions = {
			numWords: 2,
			separator: '-',
			capitalize: true,
			includeNumber: true,
			includeSymbol: true,
			selectedCategories: defaultCategories
		};
		const passphrase = generatePassphraseService(options);
		expect(passphrase).toMatch(/\d+[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]$/);
	});

	it('should use only selected categories and cycle through them', () => {
		const options: PassphraseOptions = {
			numWords: 3, 
			separator: '-',
			capitalize: false,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: ['Colors', 'Window Parts']
		};
		const passphrase = generatePassphraseService(options);
		const words = passphrase.split(options.separator);
		const colorsList = categories.find(c => c.name === 'Colors')?.words.map(w => w.toLowerCase()) || [];
		const windowPartsList = categories.find(c => c.name === 'Window Parts')?.words.map(w => w.toLowerCase()) || [];

		expect(colorsList).toContain(words[0].toLowerCase());
		expect(windowPartsList).toContain(words[1].toLowerCase());
		expect(colorsList).toContain(words[2].toLowerCase());
	});

	it('should return an error message if no categories are selected', () => {
		const options: PassphraseOptions = {
			numWords: 4,
			separator: '-',
			capitalize: false,
			includeNumber: false,
			includeSymbol: false,
			selectedCategories: [] 
		};
		const passphrase = generatePassphraseService(options);
		expect(passphrase).toBe('Error: Please select at least one word category.');
	});
});

describe('calculatePassphraseStrength', () => {
	it('should return Very Weak for minimal options (2 words, no extras)', () => {
		const opts: PassphraseOptions = { numWords: 2, separator: '-', capitalize: false, includeNumber: false, includeSymbol: false, selectedCategories: ['Adjectives'] };
		const result = calculatePassphraseStrength('Lazy-Dog', opts);
		expect(result.label).toBe('Very Weak');
		expect(result.score).toBe(0);
	});

	it('should return Weak with more words or one extra', () => {
		let opts: PassphraseOptions = { numWords: 3, separator: '-', capitalize: false, includeNumber: false, includeSymbol: false, selectedCategories: ['Adjectives', 'Animals'] };
		let result = calculatePassphraseStrength('Lazy-Dog-Quick', opts);
		expect(result.label).toBe('Weak'); // numWords (1) + cap (0) + num (0) + sym (0) = 1 -> score 3 = weak
		expect(result.score).toBe(1);

		opts = { numWords: 2, separator: '-', capitalize: true, includeNumber: false, includeSymbol: false, selectedCategories: ['Adjectives'] };
		result = calculatePassphraseStrength('Lazy-Dog', opts);
		expect(result.label).toBe('Weak'); // numWords (1) + cap (1) = 2 -> score 3 = weak
		expect(result.score).toBe(1);
	});

	it('should return Medium with 4 words and one extra, or fewer words and multiple extras', () => {
		let opts: PassphraseOptions = { numWords: 4, separator: '-', capitalize: true, includeNumber: false, includeSymbol: false, selectedCategories: ['Adjectives', 'Animals'] };
		let result = calculatePassphraseStrength('Lazy-Dog-Quick-Fox', opts);
		expect(result.label).toBe('Medium'); // numWords (2) + cap (1) = 3 -> score 4 = medium
		expect(result.score).toBe(2);

		opts = { numWords: 2, separator: '-', capitalize: true, includeNumber: true, includeSymbol: true, selectedCategories: ['Adjectives'] };
		result = calculatePassphraseStrength('Lazy-Dog1!', opts);
		expect(result.label).toBe('Medium'); // numWords (1) + cap (1) + num (1) + sym (1) = 4 -> score 4 = medium
		expect(result.score).toBe(2);
	});

	it('should return Strong for more words and multiple extras', () => {
		const opts: PassphraseOptions = { numWords: 5, separator: '-', capitalize: true, includeNumber: true, includeSymbol: false, selectedCategories: defaultCategories };
		const result = calculatePassphraseStrength('Quick-Brown-Fox-Jumps-Over1', opts);
		expect(result.label).toBe('Strong'); // numWords (2) + cap (1) + num (1) + sym (0) = 4 -> score 5 = strong
		expect(result.score).toBe(3);
	});

	it('should return Very Strong for many words and all extras', () => {
		const opts: PassphraseOptions = { numWords: 6, separator: '-', capitalize: true, includeNumber: true, includeSymbol: true, selectedCategories: defaultCategories };
		const result = calculatePassphraseStrength('The-Quick-Brown-Fox-Jumps-Over1!', opts);
		expect(result.label).toBe('Very Strong'); // numWords (3) + cap (1) + num (1) + sym (1) = 6 -> score 6 = very strong
		expect(result.score).toBe(4);
	});

	it('should return - for error passphrase', () => {
		const opts: PassphraseOptions = { numWords: 0, separator: '-', capitalize: false, includeNumber: false, includeSymbol: false, selectedCategories: [] };
		const result = calculatePassphraseStrength('Error: Please select at least one word category.', opts);
		expect(result.label).toBe('-');
		expect(result.score).toBe(0);
	});
}); 