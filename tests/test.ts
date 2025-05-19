import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	// Go to the starting url before each test
	await page.goto('/');
});

test('page has expected title', async ({ page }) => {
	await expect(page).toHaveTitle(/Dinopass Clone - Passphrase/);
});

test('loads with default passphrase and UI options', async ({ page }) => {
	const passphraseDisplay = page.locator('main section:first-of-type span');
	const numWords = 4; // Default
	const separator = '-'; // Default

	await expect(passphraseDisplay).not.toBeEmpty();
	const initialPassphrase = await passphraseDisplay.textContent() ?? '';
	
	// Rough check for word count
	const corePassphrase = initialPassphrase.replace(/\d*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]*$/, '');
	expect(corePassphrase.split(separator).length).toBe(numWords);

	// Check default UI settings
	await expect(page.getByLabel('Number of Words:')).toContainText(String(numWords));
	await expect(page.getByLabel('Separator')).toHaveValue(separator);
	await expect(page.getByLabel('Capitalize Words')).toBeChecked();
	await expect(page.getByLabel('Include Number')).toBeChecked();
	await expect(page.getByLabel('Include Symbol')).toBeChecked();

	// Check default category selections (Adjectives, Animals)
	await expect(page.getByLabel('Adjectives')).toBeChecked();
	await expect(page.getByLabel('Animals')).toBeChecked();
	await expect(page.getByLabel('Colors')).not.toBeChecked();
	await expect(page.getByLabel('Window Parts')).not.toBeChecked();
});

test('changing settings updates generated passphrase (including categories)', async ({ page }) => {
	const passphraseDisplay = page.locator('main section:first-of-type span');
	const generateButton = page.getByRole('button', { name: 'Generate Passphrase' });

	// 1. Change settings: 3 words, space separator, no capitalize, no num, no symbol, only Colors & Window Parts
	const targetNumWords = 3;
	const targetSeparator = ' ';
	await page.locator('#numWords').fill(String(targetNumWords));
	await page.getByLabel('Separator').fill(targetSeparator);
	await page.getByLabel('Capitalize Words').uncheck();
	await page.getByLabel('Include Number').uncheck();
	await page.getByLabel('Include Symbol').uncheck();

	// Uncheck default categories
	await page.getByLabel('Adjectives').uncheck();
	await page.getByLabel('Animals').uncheck();
	// Check new categories
	await page.getByLabel('Colors').check();
	await page.getByLabel('Window Parts').check();
	
	await generateButton.click();

	let newPassphrase = await passphraseDisplay.textContent() ?? '';
	const words = newPassphrase.split(targetSeparator);
	expect(words).toHaveLength(targetNumWords);

	words.forEach(word => {
		expect(word).toMatch(/^[a-z]+$/); // All lowercase
	});
	expect(newPassphrase).not.toMatch(/\d$/);
	expect(newPassphrase).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]$/);
	// We can't easily verify word *type* here without more complex logic or specific word lists
	// But we know 2 categories are selected and words are generated.
});

test('copy button works', async ({ page }) => {
	const copyButton = page.getByRole('button', { name: 'Copy' });
	await expect(copyButton).toBeEnabled();
	await copyButton.click();
	await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
	await expect(copyButton).toBeDisabled();
	await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible({ timeout: 2000 });
	await expect(copyButton).toBeEnabled();
});

test('shows error message if no categories are selected', async ({ page }) => {
	const passphraseDisplay = page.locator('main section:first-of-type span');
	const generateButton = page.getByRole('button', { name: 'Generate Passphrase' });

	// Uncheck all categories
	await page.getByLabel('Adjectives').uncheck();
	await page.getByLabel('Animals').uncheck();
	await page.getByLabel('Colors').uncheck(); 
	await page.getByLabel('Window Parts').uncheck();

	await generateButton.click();
	await expect(passphraseDisplay).toHaveText('Error: Please select at least one word category.');
}); 