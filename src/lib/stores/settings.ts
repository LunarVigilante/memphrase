import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface AppSettings {
	// Word-based settings
	numWords: number;
	selectedCategories: string[];
	capitalize: boolean;
	separator: string;
	numDigits: number;
	numSymbols: number;
	numSymPosition: 'append' | 'prepend' | 'interspersed';
	charGrouping: 'together' | 'separate';
	customSymbolsWordMode: string[];
	
	// Random character settings
	randomPasswordLength: number;
	randomIncludeLowercase: boolean;
	randomIncludeUppercase: boolean;
	randomIncludeNumbers: boolean;
	randomIncludeSymbols: boolean;
	customSymbolsRandomMode: string[];
	
	// General settings
	generationMode: 'words' | 'randomChars';
	autoCopy: boolean;
}

const defaultSettings: AppSettings = {
	// Word-based defaults
	numWords: 4,
	selectedCategories: ['Adjectives', 'Nouns', 'Verbs'],
	capitalize: true,
	separator: '-',
	numDigits: 0,
	numSymbols: 0,
	numSymPosition: 'append',
	charGrouping: 'together',
	customSymbolsWordMode: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/'],
	
	// Random character defaults
	randomPasswordLength: 16,
	randomIncludeLowercase: true,
	randomIncludeUppercase: true,
	randomIncludeNumbers: true,
	randomIncludeSymbols: false,
	customSymbolsRandomMode: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/'],
	
	// General defaults
	generationMode: 'words',
	autoCopy: false
};

function createSettingsStore() {
	const { subscribe, set, update } = writable<AppSettings>(defaultSettings);

	return {
		subscribe,
		set,
		update,
		
		// Load settings from localStorage
		load: () => {
			if (!browser) return;
			
			try {
				const saved = localStorage.getItem('memphrase-settings');
				if (saved) {
					const parsedSettings = JSON.parse(saved);
					// Merge with defaults to ensure all properties exist
					const mergedSettings = { ...defaultSettings, ...parsedSettings };
					set(mergedSettings);
				}
			} catch (error) {
				console.error('Error loading settings:', error);
				set(defaultSettings);
			}
		},
		
		// Save settings to localStorage
		save: (settings: AppSettings) => {
			if (!browser) return;
			
			try {
				localStorage.setItem('memphrase-settings', JSON.stringify(settings));
				set(settings);
			} catch (error) {
				console.error('Error saving settings:', error);
			}
		},
		
		// Reset to defaults
		reset: () => {
			if (browser) {
				localStorage.removeItem('memphrase-settings');
			}
			set(defaultSettings);
		},
		
		// Update a specific setting
		updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
			update(settings => {
				const newSettings = { ...settings, [key]: value };
				if (browser) {
					try {
						localStorage.setItem('memphrase-settings', JSON.stringify(newSettings));
					} catch (error) {
						console.error('Error saving setting:', error);
					}
				}
				return newSettings;
			});
		}
	};
}

export const settings = createSettingsStore(); 