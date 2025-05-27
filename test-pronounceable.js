// Test pronounceable password generation
import { generatePassphraseService } from './src/lib/passwordUtils.ts';

console.log('Testing pronounceable generation...');

const testOptions = {
  generationMode: 'pronounceable',
  numWords: 0,
  selectedCategories: [],
  separator: '',
  capitalize: true,
  numDigits: 2,
  numSymbols: 1,
  numSymPosition: 'append',
  charGrouping: 'together',
  pronounceableSyllables: 4,
  pronounceableComplexity: 'balanced',
  customSymbols: ['!', '@', '#', '$', '%']
};

try {
  const result = generatePassphraseService(testOptions);
  console.log('Generated pronounceable password:', result);
  console.log('Length:', result.length);
} catch (error) {
  console.error('Error:', error.message);
} 