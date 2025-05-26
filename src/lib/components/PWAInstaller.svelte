<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isOnline = true;
	let isInstallable = false;
	let isInstalled = false;
	let showInstallPrompt = false;
	let deferredPrompt: any = null;
	let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

	// Check if running as PWA
	$: isInstalled = browser && (
		window.matchMedia('(display-mode: standalone)').matches ||
		(window.navigator as any)?.standalone === true ||
		document.referrer.includes('android-app://')
	);

	onMount(() => {
		if (!browser) return;

		// Register service worker
		registerServiceWorker();

		// Listen for install prompt
		window.addEventListener('beforeinstallprompt', handleInstallPrompt);

		// Listen for online/offline status
		window.addEventListener('online', () => isOnline = true);
		window.addEventListener('offline', () => isOnline = false);
		isOnline = navigator.onLine;

		// Listen for app installation
		window.addEventListener('appinstalled', () => {
			isInstalled = true;
			showInstallPrompt = false;
			console.log('MemPhrase PWA installed successfully');
		});

		// Check if already installed
		if (isInstalled) {
			showInstallPrompt = false;
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
			window.removeEventListener('online', () => isOnline = true);
			window.removeEventListener('offline', () => isOnline = false);
		};
	});

	async function registerServiceWorker() {
		if (!browser || !('serviceWorker' in navigator)) {
			console.log('Service Worker not supported');
			return;
		}

		try {
			serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/'
			});

			console.log('MemPhrase SW registered successfully:', serviceWorkerRegistration.scope);

			// Handle service worker updates
			serviceWorkerRegistration.addEventListener('updatefound', () => {
				const newWorker = serviceWorkerRegistration!.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							// New version available
							showUpdateAvailable();
						}
					});
				}
			});

			// Handle messages from service worker
			navigator.serviceWorker.addEventListener('message', (event) => {
				if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
					showUpdateAvailable();
				}
			});

		} catch (error) {
			console.error('Service Worker registration failed:', error);
		}
	}

	function handleInstallPrompt(event: Event) {
		// Prevent automatic prompt
		event.preventDefault();
		deferredPrompt = event;
		isInstallable = true;
		
		// Show install prompt after a delay (not immediately)
		setTimeout(() => {
			if (!isInstalled) {
				showInstallPrompt = true;
			}
		}, 10000); // Show after 10 seconds
	}

	async function installPWA() {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for user choice
		const { outcome } = await deferredPrompt.userChoice;
		
		if (outcome === 'accepted') {
			console.log('User accepted PWA installation');
		} else {
			console.log('User dismissed PWA installation');
		}

		// Clear the prompt
		deferredPrompt = null;
		showInstallPrompt = false;
	}

	function dismissInstallPrompt() {
		showInstallPrompt = false;
		// Don't show again for this session
		sessionStorage.setItem('pwa-install-dismissed', 'true');
	}

	function showUpdateAvailable() {
		// You could show a toast/notification here
		console.log('MemPhrase update available');
		
		// Automatically update (or you could ask user)
		if (serviceWorkerRegistration?.waiting) {
			serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
		}
	}

	// Check if install prompt was dismissed this session
	$: if (browser && sessionStorage.getItem('pwa-install-dismissed')) {
		showInstallPrompt = false;
	}
</script>

<!-- Offline Status Indicator -->
{#if !isOnline}
	<div class="fixed top-0 left-0 right-0 z-50 bg-orange-600 text-white text-center py-2 text-sm">
		📶 You're offline - MemPhrase works offline for password generation!
	</div>
{/if}

<!-- PWA Install Prompt -->
{#if showInstallPrompt && isInstallable && !isInstalled}
	<div class="fixed bottom-4 right-4 z-40 max-w-sm">
		<div class="bg-slate-800 border border-green-500 rounded-lg p-4 shadow-xl">
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0">
					<img src="/memphrase-logo.png" alt="MemPhrase" class="w-8 h-8 rounded" loading="lazy" />
				</div>
				<div class="flex-1">
					<h3 class="text-sm font-semibold text-slate-100 mb-1">
						Install MemPhrase
					</h3>
					<p class="text-xs text-slate-300 mb-3">
						Install for offline access and faster loading. Works without internet!
					</p>
					<div class="flex gap-2">
						<button
							on:click={installPWA}
							class="button-gleam bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
						>
							Install
						</button>
						<button
							on:click={dismissInstallPrompt}
							class="text-slate-400 hover:text-slate-300 text-xs px-3 py-1.5 transition-colors"
						>
							Not now
						</button>
					</div>
				</div>
				<button
					on:click={dismissInstallPrompt}
					class="flex-shrink-0 text-slate-400 hover:text-slate-300 transition-colors"
					aria-label="Dismiss install prompt"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- PWA Status Indicator (for debugging) -->
{#if browser && import.meta.env.DEV}
	<div class="fixed bottom-4 left-4 z-30 text-xs text-slate-500">
		<div class="bg-slate-800/80 rounded px-2 py-1">
			PWA: {isInstalled ? '✅ Installed' : '📱 Web'} | 
			SW: {serviceWorkerRegistration ? '✅' : '❌'} |
			Online: {isOnline ? '✅' : '❌'}
		</div>
	</div>
{/if}

<style>
	/* Ensure install prompt is above other content */
	.fixed {
		pointer-events: auto;
	}
</style> 