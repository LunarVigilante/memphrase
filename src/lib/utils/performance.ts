// Performance monitoring utilities
import { browser } from '$app/environment';

interface PerformanceMetric {
	name: string;
	startTime: number;
	endTime?: number;
	duration?: number;
	metadata?: Record<string, any>;
}

class PerformanceTracker {
	private metrics: Map<string, PerformanceMetric> = new Map();
	private enabled = browser && window.performance !== undefined;

	/**
	 * Start tracking a performance metric
	 */
	start(name: string, metadata?: Record<string, any>): void {
		if (!this.enabled) return;

		this.metrics.set(name, {
			name,
			startTime: performance.now(),
			metadata
		});
	}

	/**
	 * End tracking a performance metric
	 */
	end(name: string): number | null {
		if (!this.enabled) return null;

		const metric = this.metrics.get(name);
		if (!metric) {
			console.warn(`Performance metric "${name}" was not started`);
			return null;
		}

		const endTime = performance.now();
		const duration = endTime - metric.startTime;

		metric.endTime = endTime;
		metric.duration = duration;

		// Log performance in development
		if (import.meta.env.DEV) {
			console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`, metric.metadata || '');
		}

		return duration;
	}

	/**
	 * Get a specific metric
	 */
	getMetric(name: string): PerformanceMetric | null {
		return this.metrics.get(name) || null;
	}

	/**
	 * Get all metrics
	 */
	getAllMetrics(): PerformanceMetric[] {
		return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
	}

	/**
	 * Clear all metrics
	 */
	clear(): void {
		this.metrics.clear();
	}

	/**
	 * Get performance summary
	 */
	getSummary(): {
		totalMetrics: number;
		averageDuration: number;
		slowestMetric: PerformanceMetric | null;
		fastestMetric: PerformanceMetric | null;
	} {
		const completedMetrics = this.getAllMetrics();
		
		if (completedMetrics.length === 0) {
			return {
				totalMetrics: 0,
				averageDuration: 0,
				slowestMetric: null,
				fastestMetric: null
			};
		}

		const durations = completedMetrics.map(m => m.duration!);
		const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
		
		const slowestMetric = completedMetrics.reduce((prev, current) => 
			(prev.duration! > current.duration!) ? prev : current
		);
		
		const fastestMetric = completedMetrics.reduce((prev, current) => 
			(prev.duration! < current.duration!) ? prev : current
		);

		return {
			totalMetrics: completedMetrics.length,
			averageDuration,
			slowestMetric,
			fastestMetric
		};
	}
}

// Global performance tracker instance
export const perf = new PerformanceTracker();

/**
 * Decorator for timing async functions
 */
export function timeAsync<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	name?: string
): T {
	return (async (...args: Parameters<T>) => {
		const metricName = name || fn.name || 'anonymous_async';
		perf.start(metricName, { args: args.length });
		
		try {
			const result = await fn(...args);
			perf.end(metricName);
			return result;
		} catch (error) {
			perf.end(metricName);
			throw error;
		}
	}) as T;
}

/**
 * Decorator for timing sync functions
 */
export function timeSync<T extends (...args: any[]) => any>(
	fn: T,
	name?: string
): T {
	return ((...args: Parameters<T>) => {
		const metricName = name || fn.name || 'anonymous_sync';
		perf.start(metricName, { args: args.length });
		
		try {
			const result = fn(...args);
			perf.end(metricName);
			return result;
		} catch (error) {
			perf.end(metricName);
			throw error;
		}
	}) as T;
}

/**
 * Simple debounce utility for performance
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

/**
 * Throttle utility for performance
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let lastCall = 0;
	
	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
}

/**
 * Memory usage tracker (if available)
 */
export function getMemoryUsage(): {
	used: number;
	total: number;
	percentage: number;
} | null {
	if (!browser || !('memory' in performance)) return null;
	
	const memory = (performance as any).memory;
	return {
		used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
		total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
		percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
	};
} 