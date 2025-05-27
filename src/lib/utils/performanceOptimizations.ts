/**
 * Performance optimization utilities for MemPhrase
 * Includes lazy loading, debouncing, memoization, and other performance enhancements
 */

import { browser } from '$app/environment';

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate = false
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	
	return function (this: any, ...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(this, args);
		};
		
		const callNow = immediate && !timeout;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		
		if (callNow) func.apply(this, args);
	};
}

/**
 * Throttle function to ensure a function is called at most once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	
	return function (this: any, ...args: Parameters<T>) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
}

/**
 * Simple memoization for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
	const cache = new Map();
	
	return ((...args: Parameters<T>) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		
		const result = fn(...args);
		cache.set(key, result);
		return result;
	}) as T;
}

/**
 * Lazy load components or modules
 */
export async function lazyLoad<T>(
	loader: () => Promise<T>,
	fallback?: T
): Promise<T> {
	if (!browser) {
		return fallback || ({} as T);
	}
	
	try {
		return await loader();
	} catch (error) {
		console.warn('Lazy load failed:', error);
		return fallback || ({} as T);
	}
}

/**
 * Intersection Observer utility for lazy loading elements
 */
export function createIntersectionObserver(
	callback: IntersectionObserverCallback,
	options: IntersectionObserverInit = {}
): IntersectionObserver | null {
	if (!browser || !('IntersectionObserver' in window)) {
		return null;
	}
	
	return new IntersectionObserver(callback, {
		rootMargin: '10px',
		threshold: 0.1,
		...options
	});
}

/**
 * Virtual scrolling utility for large lists
 */
export class VirtualList {
	private container: HTMLElement;
	private itemHeight: number;
	private visibleCount: number;
	private startIndex = 0;
	private endIndex = 0;
	
	constructor(container: HTMLElement, itemHeight: number, visibleCount: number) {
		this.container = container;
		this.itemHeight = itemHeight;
		this.visibleCount = visibleCount;
	}
	
	updateVisibleRange(scrollTop: number) {
		this.startIndex = Math.floor(scrollTop / this.itemHeight);
		this.endIndex = Math.min(this.startIndex + this.visibleCount, this.getTotalItems());
		return { startIndex: this.startIndex, endIndex: this.endIndex };
	}
	
	getTotalItems(): number {
		return this.container.children.length;
	}
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string = 'fetch'): void {
	if (!browser) return;
	
	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = href;
	link.as = as;
	document.head.appendChild(link);
}

/**
 * Web Worker utility for CPU-intensive tasks
 */
export class WorkerPool {
	private workers: Worker[] = [];
	private queue: Array<{
		data: any;
		resolve: (value: any) => void;
		reject: (error: any) => void;
	}> = [];
	private maxWorkers: number;
	
	constructor(workerScript: string, maxWorkers: number = navigator.hardwareConcurrency || 4) {
		this.maxWorkers = maxWorkers;
		
		if (browser && typeof Worker !== 'undefined') {
			for (let i = 0; i < maxWorkers; i++) {
				try {
					const worker = new Worker(workerScript);
					this.workers.push(worker);
				} catch (error) {
					console.warn('Failed to create worker:', error);
					break;
				}
			}
		}
	}
	
	async execute(data: any): Promise<any> {
		if (this.workers.length === 0) {
			throw new Error('No workers available');
		}
		
		return new Promise((resolve, reject) => {
			this.queue.push({ data, resolve, reject });
			this.processQueue();
		});
	}
	
	private processQueue() {
		if (this.queue.length === 0) return;
		
		const availableWorker = this.workers.find(worker => !worker.onmessage);
		if (!availableWorker) return;
		
		const task = this.queue.shift()!;
		
		availableWorker.onmessage = (event) => {
			task.resolve(event.data);
			availableWorker.onmessage = null;
			this.processQueue();
		};
		
		availableWorker.onerror = (error) => {
			task.reject(error);
			availableWorker.onmessage = null;
			this.processQueue();
		};
		
		availableWorker.postMessage(task.data);
	}
	
	terminate() {
		this.workers.forEach(worker => worker.terminate());
		this.workers = [];
		this.queue = [];
	}
}

/**
 * Bundle size optimization - dynamic imports
 * Note: Only add imports for modules that are actually installed
 */
export const importOnDemand = {
	// Example of how to add lazy-loaded modules when needed:
	// async someModule() {
	//   const module = await import('some-installed-module');
	//   return module;
	// }
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
	private marks = new Map<string, number>();
	
	mark(name: string) {
		if (browser && 'performance' in window) {
			performance.mark(name);
			this.marks.set(name, performance.now());
		}
	}
	
	measure(name: string, startMark: string, endMark?: string): number | null {
		if (!browser || !('performance' in window)) return null;
		
		try {
			if (endMark) {
				performance.measure(name, startMark, endMark);
			} else {
				performance.measure(name, startMark);
			}
			
			const measures = performance.getEntriesByName(name, 'measure');
			return measures.length > 0 ? measures[measures.length - 1].duration : null;
		} catch (error) {
			console.warn('Performance measurement failed:', error);
			return null;
		}
	}
	
	getMetrics() {
		if (!browser || !('performance' in window)) return {};
		
		return {
			navigation: performance.getEntriesByType('navigation')[0],
			paint: performance.getEntriesByType('paint'),
			marks: Array.from(this.marks.entries()),
			memory: (performance as any).memory
		};
	}
}

/**
 * Resource optimization utilities
 */
export const resourceOptimization = {
	/**
	 * Optimize images by converting to WebP if supported
	 */
	getOptimizedImageSrc(src: string, fallback: string = src): string {
		if (!browser) return fallback;
		
		const canvas = document.createElement('canvas');
		const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
		
		if (supportsWebP && src.includes('.')) {
			return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
		}
		
		return fallback;
	},
	
	/**
	 * Preload critical fonts
	 */
	preloadFonts(fonts: string[]) {
		if (!browser) return;
		
		fonts.forEach(font => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.href = font;
			link.as = 'font';
			link.type = 'font/woff2';
			link.crossOrigin = 'anonymous';
			document.head.appendChild(link);
		});
	}
}; 