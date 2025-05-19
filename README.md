# MemPhrase - Memorable Passphrase Generator

MemPhrase is a web-based tool designed to help you generate strong, memorable passphrases. Instead of complex, hard-to-remember passwords, MemPhrase creates phrases from a curated set of word categories, combining them with optional numbers and symbols for enhanced security.

Built with SvelteKit, TypeScript, and Tailwind CSS.

## Features

*   **Customizable Passphrase Length:** Choose the number of words (2-8) for your passphrase.
*   **Word Category Selection:** Select from diverse word categories (Adjectives, Animals, Colors, Common Objects, Verbs) to tailor your passphrase.
*   **Smart Word Selection:** Ensures variety by attempting to pick one word from each of your selected categories first, before cycling through them for longer passphrases.
*   **Flexible Separators:** Use common separators (like '-', '_', ' ') or define your own.
*   **Capitalization:** Option to capitalize each word in the passphrase.
*   **Number Inclusion:** 
    *   Option to include numbers.
    *   Specify the exact number of digits (0-4).
*   **Symbol Inclusion:**
    *   Option to include symbols.
    *   Specify the exact number of symbols (0-4).
*   **Number/Symbol Positioning:** Choose to append, prepend, or intersperse the block of numbers/symbols within the words.
*   **Strength Indicator:** Visual feedback on the estimated strength and entropy of the generated passphrase.
*   **Copy to Clipboard:** Easily copy the generated passphrase.
*   **Auto-Copy Option:** Choose to automatically copy newly generated passphrases to the clipboard.
*   **Previous Passphrase:** Quickly view and revert to the previously generated passphrase.
*   **Responsive UI:** Clean, dark-themed interface that adapts to different screen sizes.
*   **Settings Persistence:** Your preferred settings are saved in localStorage for convenience.

## Development

This project is built using SvelteKit.

1.  **Install Dependencies:**
    ```bash
    npm install
    # or pnpm install / yarn install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    # or to open in browser
    npm run dev -- --open
    ```

## Building for Production

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Testing

*   **Unit Tests (Vitest):**
    ```bash
    npm run test:unit
    ```
*   **End-to-End Tests (Playwright):**
    ```bash
    npm run test:e2e
    ```
