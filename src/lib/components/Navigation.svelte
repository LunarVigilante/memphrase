<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	let showPasswordTools = false;
	let showSecurityTools = false;
	let showUtilities = false;

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			showPasswordTools = false;
			showSecurityTools = false;
			showUtilities = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});

	$: currentPath = $page.url.pathname;

	$: passwordTools = [
		{ href: '/', label: (m as any)["nav.passphrase_generator"](), icon: '🎲' },
		{ href: '/bulk-generator', label: (m as any)["nav.bulk_generator"](), icon: '📦' },
		{ href: '/password-templates', label: (m as any)["nav.password_templates"](), icon: '📋' },
		{ href: '/password-history', label: (m as any)["nav.password_history"](), icon: '🕒' },
		{ href: '/password-analyzer', label: (m as any)["nav.password_analyzer"](), icon: '🔍' }
	];

	$: securityTools = [
		{ href: '/secret-key-generator', label: (m as any)["nav.secret_keys"](), icon: '🔑' },
		{ href: '/ssh-key-generator', label: (m as any)["nav.ssh_keys"](), icon: '🔐' },
		{ href: '/totp-generator', label: (m as any)["nav.totp_2fa"](), icon: '🛡️' },
		{ href: '/recovery-codes', label: (m as any)["nav.recovery_codes"](), icon: '🆘' }
	];

	$: utilities = [
		{ href: '/uuid-generator', label: (m as any)["nav.uuid_generator"](), icon: '🆔' },
		{ href: '/checksum-generator', label: (m as any)["nav.checksums"](), icon: '✅' },
		{ href: '/certificate-generator', label: (m as any)["nav.certificates"](), icon: '📜' }
	];

	function isActive(href: string): boolean {
		return currentPath === href;
	}

	function toggleDropdown(dropdown: 'password' | 'security' | 'utilities') {
		showPasswordTools = dropdown === 'password' ? !showPasswordTools : false;
		showSecurityTools = dropdown === 'security' ? !showSecurityTools : false;
		showUtilities = dropdown === 'utilities' ? !showUtilities : false;
	}
</script>

<nav class="bg-slate-800 border-b border-slate-700 shadow-lg">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="flex items-center justify-between h-14">
			<!-- Logo and Home Link -->
			<a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
				<img src="/memphrase-logo.png" alt="MemPhrase" class="h-8 w-8" loading="lazy" />
				<span class="text-xl font-bold text-white">MemPhrase</span>
			</a>

			<!-- Navigation Menu -->
			<div class="hidden md:flex items-center gap-6">
				<!-- Password Tools Dropdown -->
				<div class="relative dropdown-container">
					<button
						on:click={() => toggleDropdown('password')}
						class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
						class:text-green-400={passwordTools.some(tool => isActive(tool.href))}
					>
						🎲 {(m as any)["nav.password_tools"]()}
						<svg class="w-4 h-4 transform transition-transform" class:rotate-180={showPasswordTools} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					
					{#if showPasswordTools}
						<div class="absolute top-full left-0 mt-1 w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50">
							{#each passwordTools as tool}
								<a
									href={tool.href}
									class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-600 transition-colors"
									class:bg-slate-600={isActive(tool.href)}
									class:text-green-400={isActive(tool.href)}
									on:click={() => showPasswordTools = false}
								>
									<span class="text-base">{tool.icon}</span>
									{tool.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Security Tools Dropdown -->
				<div class="relative dropdown-container">
					<button
						on:click={() => toggleDropdown('security')}
						class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
						class:text-blue-400={securityTools.some(tool => isActive(tool.href))}
					>
						🛡️ {(m as any)["nav.security_tools"]()}
						<svg class="w-4 h-4 transform transition-transform" class:rotate-180={showSecurityTools} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					
					{#if showSecurityTools}
						<div class="absolute top-full left-0 mt-1 w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50">
							{#each securityTools as tool}
								<a
									href={tool.href}
									class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-600 transition-colors"
									class:bg-slate-600={isActive(tool.href)}
									class:text-blue-400={isActive(tool.href)}
									on:click={() => showSecurityTools = false}
								>
									<span class="text-base">{tool.icon}</span>
									{tool.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Utilities Dropdown -->
				<div class="relative dropdown-container">
					<button
						on:click={() => toggleDropdown('utilities')}
						class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
						class:text-purple-400={utilities.some(tool => isActive(tool.href))}
					>
						⚡ {(m as any)["nav.utilities"]()}
						<svg class="w-4 h-4 transform transition-transform" class:rotate-180={showUtilities} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					
					{#if showUtilities}
						<div class="absolute top-full left-0 mt-1 w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50">
							{#each utilities as tool}
								<a
									href={tool.href}
									class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-600 transition-colors"
									class:bg-slate-600={isActive(tool.href)}
									class:text-purple-400={isActive(tool.href)}
									on:click={() => showUtilities = false}
								>
									<span class="text-base">{tool.icon}</span>
									{tool.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Direct Links -->
				<a href="/password-guide" class="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
					📚 {(m as any)["nav.guide"]()}
				</a>
			</div>

			<!-- Right Side Actions -->
			<div class="flex items-center gap-3">
				<!-- Mobile Menu Button -->
				<button class="md:hidden p-2 text-gray-300 hover:text-white" aria-label={(m as any)["aria.open_mobile_menu"]()}>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</nav> 