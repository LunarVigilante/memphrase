<script lang="ts">
	import { locales, setLocale, getLocale } from '$lib/paraglide/runtime';
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';

	// Language metadata with proper names and RTL support
	const languageData: Record<string, { name: string; nativeName: string; rtl: boolean; flag: string }> = {
		en: { name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
		es: { name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
		fr: { name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
		de: { name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
		it: { name: 'Italian', nativeName: 'Italiano', rtl: false, flag: '🇮🇹' },
		pt: { name: 'Portuguese', nativeName: 'Português', rtl: false, flag: '🇵🇹' },
		ru: { name: 'Russian', nativeName: 'Русский', rtl: false, flag: '🇷🇺' },
		zh: { name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
		ja: { name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
		ko: { name: 'Korean', nativeName: '한국어', rtl: false, flag: '🇰🇷' },
		ar: { name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
		hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' }
	};

	let isOpen = false;
	let dropdownButton: HTMLButtonElement;

	// Get current language info
	$: currentLang = languageData[getLocale()] || languageData['en'];

	function switchLanguage(newLang: string) {
		if (!browser) return;
		
		setLocale(newLang as any);
		isOpen = false;
		
		// Update document direction for RTL languages
		const isRTL = languageData[newLang]?.rtl || false;
		document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
		document.documentElement.lang = newLang;
		
		// Store preference
		localStorage.setItem('preferred-language', newLang);
		
		// Announce language change to screen readers
		if (typeof window !== 'undefined' && window.speechSynthesis) {
			const announcement = `Language changed to ${languageData[newLang]?.name || newLang}`;
			// Create a temporary announcement element
			const announcement_element = document.createElement('div');
			announcement_element.setAttribute('aria-live', 'assertive');
			announcement_element.setAttribute('aria-atomic', 'true');
			announcement_element.style.position = 'absolute';
			announcement_element.style.left = '-10000px';
			announcement_element.textContent = announcement;
			document.body.appendChild(announcement_element);
			
			setTimeout(() => {
				document.body.removeChild(announcement_element);
			}, 1000);
		}
		
		// Trigger re-render
		invalidate('app:language');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
			dropdownButton?.focus();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!dropdownButton?.contains(target) && !target.closest('.language-dropdown')) {
			isOpen = false;
		}
	}

	// Auto-detect language on mount
	if (browser) {
		const saved = localStorage.getItem('preferred-language');
		const detected = navigator.language.split('-')[0];
		
		if (saved && locales.includes(saved as any)) {
			switchLanguage(saved);
		} else if (locales.includes(detected as any)) {
			switchLanguage(detected);
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="relative inline-block text-left">
	<button
		bind:this={dropdownButton}
		on:click={() => isOpen = !isOpen}
		class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150"
		aria-expanded={isOpen}
		aria-haspopup="true"
		aria-label="Select language"
		title="Change language"
	>
		<span class="text-base" aria-hidden="true">{currentLang.flag}</span>
		<span class="hidden sm:inline" dir="ltr">{currentLang.nativeName}</span>
		<span class="sm:hidden" dir="ltr">{currentLang.flag}</span>
		<svg class="w-4 h-4 transition-transform duration-150 {isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div 
			class="language-dropdown absolute {languageData[getLocale()]?.rtl ? 'left-0' : 'right-0'} mt-2 w-64 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="language-menu"
		>
			<div class="py-1">
				{#each locales as lang (lang)}
					{@const langInfo = languageData[lang]}
					{#if langInfo}
						<button
							on:click={() => switchLanguage(lang)}
							class="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-slate-600 hover:text-gray-200 focus:outline-none focus:bg-slate-600 focus:text-gray-200 {lang === getLocale() ? 'bg-slate-600 text-green-400' : 'text-gray-300'} transition-colors duration-150"
							role="menuitem"
							dir={langInfo.rtl ? 'rtl' : 'ltr'}
							lang={lang}
						>
							<span class="text-base flex-shrink-0" aria-hidden="true">{langInfo.flag}</span>
							<div class="flex-1 min-w-0">
								<div class="font-medium">{langInfo.nativeName}</div>
								<div class="text-xs text-gray-400">{langInfo.name}</div>
							</div>
							{#if lang === getLocale()}
								<svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
			
			<div class="border-t border-slate-600 px-4 py-2">
				<p class="text-xs text-gray-400">
					Translation progress varies by language. 
					<a href="/contact" class="text-green-400 hover:text-green-300 underline">Help us improve</a>
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.language-dropdown {
		/* Ensure proper stacking above other elements */
		z-index: 1000;
	}
	
	/* RTL support for the dropdown positioning */
	:global([dir="rtl"]) .language-dropdown {
		left: 0;
		right: auto;
	}
	
	:global([dir="ltr"]) .language-dropdown {
		right: 0;
		left: auto;
	}
</style> 