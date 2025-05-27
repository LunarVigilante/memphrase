/**
 * Accessibility utilities for MemPhrase
 * Includes focus management, screen reader support, keyboard navigation, and WCAG compliance
 */

import { browser } from '$app/environment';

/**
 * Focus management utilities
 */
export class FocusManager {
	private focusHistory: HTMLElement[] = [];
	private trapStack: HTMLElement[] = [];

	/**
	 * Save current focus to history
	 */
	saveFocus(): void {
		if (!browser) return;
		const activeElement = document.activeElement as HTMLElement;
		if (activeElement && activeElement !== document.body) {
			this.focusHistory.push(activeElement);
		}
	}

	/**
	 * Restore previously saved focus
	 */
	restoreFocus(): void {
		if (!browser || this.focusHistory.length === 0) return;
		const lastFocusedElement = this.focusHistory.pop();
		if (lastFocusedElement && document.contains(lastFocusedElement)) {
			lastFocusedElement.focus();
		}
	}

	/**
	 * Trap focus within a container
	 */
	trapFocus(container: HTMLElement): () => void {
		if (!browser) return () => {};

		this.trapStack.push(container);
		const focusableElements = this.getFocusableElements(container);
		
		if (focusableElements.length === 0) return () => {};

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Focus first element
		firstElement.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;

			if (e.shiftKey) {
				// Shift + Tab
				if (document.activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				}
			} else {
				// Tab
				if (document.activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		};

		container.addEventListener('keydown', handleKeyDown);

		// Return cleanup function
		return () => {
			container.removeEventListener('keydown', handleKeyDown);
			this.trapStack.pop();
		};
	}

	/**
	 * Get all focusable elements within a container
	 */
	getFocusableElements(container: HTMLElement): HTMLElement[] {
		const focusableSelectors = [
			'button:not([disabled])',
			'[href]',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[tabindex]:not([tabindex="-1"])',
			'[contenteditable="true"]'
		].join(', ');

		return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
	}

	/**
	 * Move focus to next/previous focusable element
	 */
	moveFocus(direction: 'next' | 'previous', container?: HTMLElement): void {
		if (!browser) return;

		const root = container || document.body;
		const focusableElements = this.getFocusableElements(root);
		const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

		if (currentIndex === -1) return;

		let newIndex: number;
		if (direction === 'next') {
			newIndex = (currentIndex + 1) % focusableElements.length;
		} else {
			newIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
		}

		focusableElements[newIndex]?.focus();
	}
}

/**
 * Screen reader utilities
 */
export class ScreenReaderUtils {
	private static liveRegion: HTMLElement | null = null;

	/**
	 * Announce message to screen readers
	 */
	static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
		if (!browser) return;

		if (!this.liveRegion) {
			this.createLiveRegion();
		}

		if (this.liveRegion) {
			this.liveRegion.setAttribute('aria-live', priority);
			this.liveRegion.textContent = message;

			// Clear after announcement to prevent re-reading
			setTimeout(() => {
				if (this.liveRegion) {
					this.liveRegion.textContent = '';
				}
			}, 1000);
		}
	}

	/**
	 * Create invisible live region for announcements
	 */
	private static createLiveRegion(): void {
		if (!browser) return;

		this.liveRegion = document.createElement('div');
		this.liveRegion.setAttribute('aria-live', 'polite');
		this.liveRegion.setAttribute('aria-atomic', 'true');
		this.liveRegion.style.position = 'absolute';
		this.liveRegion.style.left = '-10000px';
		this.liveRegion.style.width = '1px';
		this.liveRegion.style.height = '1px';
		this.liveRegion.style.overflow = 'hidden';
		document.body.appendChild(this.liveRegion);
	}

	/**
	 * Check if screen reader is likely active
	 */
	static isScreenReaderActive(): boolean {
		if (!browser) return false;

		// Various heuristics to detect screen reader usage
		return Boolean(
			(window as any).speechSynthesis ||
			(navigator as any).userAgent.includes('NVDA') ||
			(navigator as any).userAgent.includes('JAWS') ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
	/**
	 * Handle arrow key navigation for custom components
	 */
	static handleArrowKeys(
		event: KeyboardEvent,
		elements: HTMLElement[],
		currentIndex: number,
		orientation: 'horizontal' | 'vertical' | 'both' = 'both'
	): number {
		const { key } = event;
		let newIndex = currentIndex;

		switch (key) {
			case 'ArrowLeft':
				if (orientation === 'horizontal' || orientation === 'both') {
					event.preventDefault();
					newIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
				}
				break;
			case 'ArrowRight':
				if (orientation === 'horizontal' || orientation === 'both') {
					event.preventDefault();
					newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
				}
				break;
			case 'ArrowUp':
				if (orientation === 'vertical' || orientation === 'both') {
					event.preventDefault();
					newIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
				}
				break;
			case 'ArrowDown':
				if (orientation === 'vertical' || orientation === 'both') {
					event.preventDefault();
					newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
				}
				break;
			case 'Home':
				event.preventDefault();
				newIndex = 0;
				break;
			case 'End':
				event.preventDefault();
				newIndex = elements.length - 1;
				break;
		}

		if (newIndex !== currentIndex && elements[newIndex]) {
			elements[newIndex].focus();
		}

		return newIndex;
	}

	/**
	 * Add keyboard event handlers to an element
	 */
	static addKeyboardHandlers(
		element: HTMLElement,
		handlers: {
			onEnter?: (event: KeyboardEvent) => void;
			onSpace?: (event: KeyboardEvent) => void;
			onEscape?: (event: KeyboardEvent) => void;
			onArrowKeys?: (event: KeyboardEvent) => void;
		}
	): () => void {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Enter':
					handlers.onEnter?.(event);
					break;
				case ' ':
				case 'Space':
					handlers.onSpace?.(event);
					break;
				case 'Escape':
					handlers.onEscape?.(event);
					break;
				case 'ArrowLeft':
				case 'ArrowRight':
				case 'ArrowUp':
				case 'ArrowDown':
				case 'Home':
				case 'End':
					handlers.onArrowKeys?.(event);
					break;
			}
		};

		element.addEventListener('keydown', handleKeyDown);

		return () => {
			element.removeEventListener('keydown', handleKeyDown);
		};
	}
}

/**
 * Color contrast utilities for accessibility
 */
export class ColorUtils {
	/**
	 * Calculate relative luminance of a color
	 */
	static getLuminance(r: number, g: number, b: number): number {
		const [rs, gs, bs] = [r, g, b].map(c => {
			c = c / 255;
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
	}

	/**
	 * Calculate contrast ratio between two colors
	 */
	static getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
		const lum1 = this.getLuminance(...color1);
		const lum2 = this.getLuminance(...color2);
		const brightest = Math.max(lum1, lum2);
		const darkest = Math.min(lum1, lum2);
		return (brightest + 0.05) / (darkest + 0.05);
	}

	/**
	 * Check if color combination meets WCAG contrast requirements
	 */
	static meetsContrastRequirement(
		foreground: [number, number, number],
		background: [number, number, number],
		level: 'AA' | 'AAA' = 'AA',
		isLargeText = false
	): boolean {
		const ratio = this.getContrastRatio(foreground, background);
		
		if (level === 'AAA') {
			return isLargeText ? ratio >= 4.5 : ratio >= 7;
		}
		return isLargeText ? ratio >= 3 : ratio >= 4.5;
	}
}

/**
 * Reduced motion utilities
 */
export class MotionUtils {
	/**
	 * Check if user prefers reduced motion
	 */
	static prefersReducedMotion(): boolean {
		if (!browser) return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	/**
	 * Apply animation only if motion is not reduced
	 */
	static conditionalAnimation<T>(
		element: HTMLElement,
		animation: (element: HTMLElement) => T,
		fallback?: (element: HTMLElement) => T
	): T | void {
		if (this.prefersReducedMotion()) {
			return fallback?.(element);
		}
		return animation(element);
	}
}

/**
 * Form accessibility utilities
 */
export class FormUtils {
	/**
	 * Add comprehensive ARIA labels and descriptions to form fields
	 */
	static enhanceFormField(
		field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
		options: {
			label?: string;
			description?: string;
			errorMessage?: string;
			required?: boolean;
		}
	): void {
		const { label, description, errorMessage, required } = options;

		// Add required aria attributes
		if (required) {
			field.setAttribute('aria-required', 'true');
		}

		// Add description if provided
		if (description) {
			const descId = `${field.id || 'field'}-desc`;
			let descElement = document.getElementById(descId);
			
			if (!descElement) {
				descElement = document.createElement('div');
				descElement.id = descId;
				descElement.className = 'sr-only';
				field.parentNode?.insertBefore(descElement, field.nextSibling);
			}
			
			descElement.textContent = description;
			field.setAttribute('aria-describedby', descId);
		}

		// Add error message if provided
		if (errorMessage) {
			const errorId = `${field.id || 'field'}-error`;
			let errorElement = document.getElementById(errorId);
			
			if (!errorElement) {
				errorElement = document.createElement('div');
				errorElement.id = errorId;
				errorElement.className = 'text-red-400 text-sm mt-1';
				errorElement.setAttribute('role', 'alert');
				field.parentNode?.insertBefore(errorElement, field.nextSibling);
			}
			
			errorElement.textContent = errorMessage;
			field.setAttribute('aria-describedby', 
				[field.getAttribute('aria-describedby'), errorId].filter(Boolean).join(' ')
			);
			field.setAttribute('aria-invalid', 'true');
		} else {
			field.removeAttribute('aria-invalid');
		}
	}

	/**
	 * Validate form accessibility
	 */
	static validateFormAccessibility(form: HTMLFormElement): string[] {
		const issues: string[] = [];
		const inputs = form.querySelectorAll('input, select, textarea');

		inputs.forEach((input, index) => {
			const element = input as HTMLInputElement;
			
			// Check for labels
			const hasLabel = element.labels && element.labels.length > 0;
			const hasAriaLabel = element.hasAttribute('aria-label');
			const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
			
			if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
				issues.push(`Input ${index + 1} lacks proper labeling`);
			}

			// Check for required fields
			if (element.required && !element.hasAttribute('aria-required')) {
				issues.push(`Required input ${index + 1} missing aria-required`);
			}
		});

		return issues;
	}
}

/**
 * Global accessibility manager
 */
export class AccessibilityManager {
	private focusManager: FocusManager;
	private keyboardHandlers: Map<HTMLElement, () => void> = new Map();

	constructor() {
		this.focusManager = new FocusManager();
		this.init();
	}

	private init(): void {
		if (!browser) return;

		// Create live region for announcements
		ScreenReaderUtils.announce(''); // Initialize

		// Add global keyboard shortcuts
		document.addEventListener('keydown', this.handleGlobalKeyboard.bind(this));
		
		// Add focus indicators for keyboard navigation
		this.enhanceFocusVisibility();
	}

	private handleGlobalKeyboard(event: KeyboardEvent): void {
		// Skip links with Alt + K
		if (event.altKey && event.key === 'k') {
			event.preventDefault();
			this.showSkipLinks();
		}

		// Focus main content with Alt + M
		if (event.altKey && event.key === 'm') {
			event.preventDefault();
			const main = document.querySelector('main');
			if (main) {
				(main as HTMLElement).focus();
			}
		}
	}

	private showSkipLinks(): void {
		const skipLinks = document.querySelectorAll('.skip-link');
		skipLinks.forEach(link => {
			(link as HTMLElement).focus();
		});
	}

	private enhanceFocusVisibility(): void {
		// Add high-contrast focus ring for better visibility
		const style = document.createElement('style');
		style.textContent = `
			.enhanced-focus:focus {
				outline: 3px solid #22C55E !important;
				outline-offset: 2px !important;
				box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.2) !important;
			}
			
			.enhanced-focus:focus:not(:focus-visible) {
				outline: none !important;
				box-shadow: none !important;
			}
		`;
		document.head.appendChild(style);
	}

	/**
	 * Register element for enhanced accessibility
	 */
	registerElement(element: HTMLElement, options: {
		skipLink?: boolean;
		announceOnFocus?: string;
		keyboardHandlers?: Parameters<typeof KeyboardNavigation.addKeyboardHandlers>[1];
	}): void {
		const { skipLink, announceOnFocus, keyboardHandlers } = options;

		// Add enhanced focus class
		element.classList.add('enhanced-focus');

		// Add skip link functionality
		if (skipLink) {
			element.setAttribute('tabindex', '0');
		}

		// Add focus announcements
		if (announceOnFocus) {
			element.addEventListener('focus', () => {
				ScreenReaderUtils.announce(announceOnFocus);
			});
		}

		// Add keyboard handlers
		if (keyboardHandlers) {
			const cleanup = KeyboardNavigation.addKeyboardHandlers(element, keyboardHandlers);
			this.keyboardHandlers.set(element, cleanup);
		}
	}

	/**
	 * Unregister element
	 */
	unregisterElement(element: HTMLElement): void {
		const cleanup = this.keyboardHandlers.get(element);
		if (cleanup) {
			cleanup();
			this.keyboardHandlers.delete(element);
		}
	}

	/**
	 * Get focus manager instance
	 */
	getFocusManager(): FocusManager {
		return this.focusManager;
	}
}

// Export singleton instance
export const accessibilityManager = new AccessibilityManager(); 