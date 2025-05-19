## 2025-05-12

*   Initialized SvelteKit project with TS, Tailwind, ESLint, Prettier, Vitest, Playwright.
*   Created initial documentation files (`plan.md`, `progress.md`, `TODO.txt`).
*   Added basic UI structure and placeholders to `src/routes/+page.svelte`.
*   Implemented core password generation logic in `src/lib/passwordUtils.ts`.
*   Connected UI controls in `+page.svelte` to the password generation service.
*   Implemented 'Copy to Clipboard' functionality with visual feedback.
*   Refined UI styling using Tailwind CSS for better appearance and UX.
*   Added unit tests for `passwordUtils.ts` using Vitest.
*   Enhanced `passwordUtils.ts` to guarantee inclusion of selected character types (initial version).
*   Updated unit tests to reflect enhanced password generation logic.
*   Added end-to-end UI tests using Playwright in `tests/test.ts`.
*   Implemented dark mode default and theme toggle component.
*   Added password strength calculation and display indicator.

## 2025-05-13 (Assumed Date for Recent Changes)

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## Work Completed

- **Fix 500 Error:** Resolved issues related to missing favicon, which was causing server errors.
- **Runtime Error Resolution:** Fixed a missing import for `estimateTimeToCrack`.
- **Feature: Random Character Password Generation Mode:**
  - Backend: Updated `PassphraseOptions`, `generatePassphraseService`, and `calculatePassphraseStrength` in `passwordUtils.ts` to support random character generation alongside word-based passphrases.
  - UI: Added mode selector, conditional options for random length and character types, and updated settings persistence in `+page.svelte`.
- **Entropy Calculation & Display Logic Overhauls:**
  - Initially, removed time-to-crack display and simplified entropy to be based on the generated string's characteristics.
  - Later reverted entropy calculation to be based on `PassphraseOptions` (generation settings) for a more predictive strength assessment.
  - Iteratively refined entropy thresholds for strength labels (Very Weak, Medium, Strong, etc.) based on user feedback to achieve desired perceived strength for different password types (e.g., 2-word passphrases as "Medium").
- **UI Enhancements & Refinements:**
  - **Layout & Spacing:** Numerous adjustments to margins and element positioning (`+page.svelte`) to condense the layout and improve visual flow (e.g., main container, generate button, options card, footer spacing).
  - **Gleam Effect:** Added CSS animation for a visual gleam/highlight to the strength meter, "Generate Passphrase"/"Copy" buttons, and the selected "Password Type" radio button label (`app.html` & `+page.svelte`). Gleam speed on buttons was adjusted.
  - **Header & Text:** Enhanced text shadow on the main "MemPhrase" header. Updated main generation button text to dynamically show "Generate Password" or "Generate Passphrase" based on selected mode.
  - **Default Separator:** Changed default separator for word-based passphrases from '-' to '.'.
  - **Symbol Customization Trigger:** Replaced "Customize Symbols" text buttons with a settings emoji (⚙️) icon button.
- **Production Preparation:**
  - **Footer:** Added a footer with dynamic year and links for Terms, Privacy, Contact, Security Tips, and Donate pages.
  - **New Informational Pages:** Created placeholder Svelte pages for `/terms`, `/privacy`, `/contact` (with basic form), `/security-tips` (with general advice & password manager links), and `/donate`.
  - **Legal Text:** Updated placeholder legal pages to remove explicit "placeholder" warnings and fill in some bracketed info with generics. Emphasized the critical need for professional legal review.
- **Accessibility:** Made multiple attempts to resolve Svelte linter warnings related to label associations (`a11y_label_has_associated_control`) and interactive element roles, particularly for form controls within custom components or complex layouts.

## 2025-05-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-22

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-23

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-24

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-25

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-26

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-27

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-28

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-29

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-30

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-05-31

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-01

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-02

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-03

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-04

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-05

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-06

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-07

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-08

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-09

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-10

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-11

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-12

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-13

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-22

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-23

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-24

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-25

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-26

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-27

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-28

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-29

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-06-30

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-01

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-02

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-03

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-04

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-05

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-06

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-07

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-08

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-09

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-10

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-11

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-12

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-13

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-22

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-23

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-24

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-25

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-26

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-27

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-28

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-29

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-30

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-07-31

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-01

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-02

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-03

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-04

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-05

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-06

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-07

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-08

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-09

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-10

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-11

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-12

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-13

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-22

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-23

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-24

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-25

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-26

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-27

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-28

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-29

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-30

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-08-31

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-01

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-02

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-03

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-04

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-05

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-06

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-07

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-08

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-09

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-10

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-11

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-12

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-13

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-22

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-23

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-24

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-25

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-26

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-27

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-28

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-29

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-09-30

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-01

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-02

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-03

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-04

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-05

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-06

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-07

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-08

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-09

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-10

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-11

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-12

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-13

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-14

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-15

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-16

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-17

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-18

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-19

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-20

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.
*   **UX Improvements:**
    *   Improved styling for the "Previous" button to clearly distinguish active/inactive states.
    *   Added input clamping (0-4) for "Number of Digits" and "Number of Symbols" fields and updated labels to suggest the range.
*   **Feature Enhancements:**
    *   Implemented "Interspersed" option for number/symbol positioning (logic and UI).
    *   Added "Auto-copy new passphrase" feature with a checkbox in General Options and localStorage persistence.
    *   Enhanced word selection logic in `passwordUtils.ts` to strive for one word from each selected category before cycling, and added shuffling for better randomness.

## 2025-10-21

*   **UI Layout & Options Refinement:**
    *   Replaced boolean "Include Number/Symbol" with numeric inputs for "Number of Digits" and "Number of Symbols".
    *   Refactored options panel layout: Moved "Word Categories" to the left; created "Numbers & Symbols" section on the right with conditional inputs for counts and position, improving balance.
*   **Bug Fixes:**
    *   Fixed "Prepend" functionality for numbers/symbols to correctly use the separator.
*   **Word Category Enhancement:**
    *   Consolidated "Nouns" and "Window Parts" into a more general "Common Objects" category.
    *   Updated `wordListSizes` in `passwordUtils.ts` for accurate strength calculation.
    *   Updated default category selections.