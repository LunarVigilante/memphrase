<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import CustomTooltip from '$lib/components/CustomTooltip.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		generatePassphraseService,
		type PassphraseOptions,
		calculatePassphraseStrength
	} from '$lib/passwordUtils';
	import { categories as wordListCategories, defaultCategories as defaultLeafCategories } from '$lib/words';
	import AnimatedStrengthMeter from '$lib/components/AnimatedStrengthMeter.svelte';

	interface PasswordTemplate {
		id: string;
		name: string;
		description: string;
		useCase: 'personal' | 'work' | 'high-security' | 'shared' | 'temporary' | 'custom';
		options: PassphraseOptions;
		createdAt: string;
		lastUsed?: string;
		usageCount: number;
	}

	// Built-in templates
	const builtInTemplates: PasswordTemplate[] = [
		{
			id: 'personal-standard',
			name: 'Personal Standard',
			description: 'Balanced security for everyday personal accounts',
			useCase: 'personal',
			options: {
				generationMode: 'words',
				numWords: 4,
				separator: '-',
				capitalize: true,
				numDigits: 2,
				numSymbols: 1,
				selectedCategories: ['Animals', 'Adjectives', 'Nouns'],
				numSymPosition: 'append',
				charGrouping: 'together'
			},
			createdAt: '2024-01-01T00:00:00.000Z',
			usageCount: 0
		},
		{
			id: 'work-professional',
			name: 'Work Professional',
			description: 'Professional strength for work accounts and corporate systems',
			useCase: 'work',
			options: {
				generationMode: 'words',
				numWords: 5,
				separator: '_',
				capitalize: true,
				numDigits: 3,
				numSymbols: 2,
				selectedCategories: ['Technology', 'Science', 'Adjectives', 'Nouns'],
				numSymPosition: 'interspersed',
				charGrouping: 'together'
			},
			createdAt: '2024-01-01T00:00:00.000Z',
			usageCount: 0
		},
		{
			id: 'high-security',
			name: 'High Security',
			description: 'Maximum strength for critical accounts (banking, crypto, etc.)',
			useCase: 'high-security',
			options: {
				generationMode: 'words',
				numWords: 6,
				separator: '.',
				capitalize: true,
				numDigits: 4,
				numSymbols: 3,
				selectedCategories: ['Animals', 'Technology', 'Science', 'Nature', 'Adjectives', 'Nouns'],
				numSymPosition: 'interspersed',
				charGrouping: 'together'
			},
			createdAt: '2024-01-01T00:00:00.000Z',
			usageCount: 0
		},
		{
			id: 'shared-simple',
			name: 'Shared Simple',
			description: 'Easy to share and remember for team or family use',
			useCase: 'shared',
			options: {
				generationMode: 'words',
				numWords: 3,
				separator: '-',
				capitalize: true,
				numDigits: 1,
				numSymbols: 0,
				selectedCategories: ['Animals', 'Colors', 'Nouns'],
				numSymPosition: 'append',
				charGrouping: 'together'
			},
			createdAt: '2024-01-01T00:00:00.000Z',
			usageCount: 0
		},
		{
			id: 'temporary-quick',
			name: 'Temporary Quick',
			description: 'For temporary accounts and short-term use',
			useCase: 'temporary',
			options: {
				generationMode: 'words',
				numWords: 3,
				separator: '-',
				capitalize: false,
				numDigits: 1,
				numSymbols: 0,
				selectedCategories: ['Animals', 'Adjectives'],
				numSymPosition: 'append',
				charGrouping: 'together'
			},
			createdAt: '2024-01-01T00:00:00.000Z',
			usageCount: 0
		}
	];

	// State
	let templates: PasswordTemplate[] = [];
	let selectedTemplate: PasswordTemplate | null = null;
	let currentPassphrase = '';
	let currentStrength: any = null;
	let isGenerating = false;

	// Template creation/editing
	let showCreateDialog = false;
	let editingTemplate: PasswordTemplate | null = null;
	let templateForm = {
		name: '',
		description: '',
		useCase: 'custom' as const,
		options: {
			generationMode: 'words' as const,
			numWords: 4,
			separator: '-',
			capitalize: true,
			numDigits: 1,
			numSymbols: 1,
			selectedCategories: [...defaultLeafCategories],
			numSymPosition: 'append' as const,
			charGrouping: 'together' as const
		}
	};

	const STORAGE_KEY = 'memphrase-templates';

	// Load templates from localStorage
	function loadTemplates() {
		if (!browser) return;
		
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const userTemplates = stored ? JSON.parse(stored) : [];
			
			// Combine built-in templates with user templates
			templates = [...builtInTemplates, ...userTemplates];
		} catch (error) {
			console.error('Failed to load templates:', error);
			templates = [...builtInTemplates];
		}
	}

	// Save user templates to localStorage (excluding built-in ones)
	function saveTemplates() {
		if (!browser) return;
		
		try {
			const userTemplates = templates.filter(t => !builtInTemplates.find(bt => bt.id === t.id));
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userTemplates));
		} catch (error) {
			console.error('Failed to save templates:', error);
		}
	}

	// Generate passphrase using selected template
	async function generateFromTemplate(template: PasswordTemplate) {
		if (isGenerating) return;
		
		isGenerating = true;
		selectedTemplate = template;
		
		try {
			currentPassphrase = generatePassphraseService(template.options);
			currentStrength = calculatePassphraseStrength(currentPassphrase, template.options);
			
			// Update usage statistics
			template.lastUsed = new Date().toISOString();
			template.usageCount += 1;
			templates = [...templates];
			saveTemplates();
		} catch (error) {
			console.error('Failed to generate passphrase:', error);
			alert('Failed to generate passphrase. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Copy passphrase to clipboard
	async function copyPassphrase() {
		if (!navigator.clipboard || !currentPassphrase) return;
		
		try {
			await navigator.clipboard.writeText(currentPassphrase);
		} catch (err) {
			console.error('Failed to copy passphrase:', err);
		}
	}

	// Open create/edit dialog
	function openCreateDialog(template?: PasswordTemplate) {
		if (template) {
			editingTemplate = template;
			templateForm = {
				name: template.name,
				description: template.description,
				useCase: template.useCase,
				options: { ...template.options }
			};
		} else {
			editingTemplate = null;
			templateForm = {
				name: '',
				description: '',
				useCase: 'custom',
				options: {
					generationMode: 'words',
					numWords: 4,
					separator: '-',
					capitalize: true,
					numDigits: 1,
					numSymbols: 1,
					selectedCategories: [...defaultLeafCategories],
					numSymPosition: 'append',
					charGrouping: 'together'
				}
			};
		}
		showCreateDialog = true;
	}

	// Save template
	function saveTemplate() {
		if (!templateForm.name.trim()) {
			alert('Please enter a template name');
			return;
		}

		const templateData: PasswordTemplate = {
			id: editingTemplate?.id || `custom-${Date.now()}`,
			name: templateForm.name,
			description: templateForm.description,
			useCase: templateForm.useCase,
			options: { ...templateForm.options },
			createdAt: editingTemplate?.createdAt || new Date().toISOString(),
			lastUsed: editingTemplate?.lastUsed,
			usageCount: editingTemplate?.usageCount || 0
		};

		if (editingTemplate) {
			// Update existing template
			const index = templates.findIndex(t => t.id === editingTemplate.id);
			if (index !== -1) {
				templates[index] = templateData;
				templates = [...templates];
			}
		} else {
			// Add new template
			templates = [...templates, templateData];
		}

		saveTemplates();
		showCreateDialog = false;
	}

	// Delete template
	function deleteTemplate(template: PasswordTemplate) {
		if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
			templates = templates.filter(t => t.id !== template.id);
			saveTemplates();
			
			if (selectedTemplate?.id === template.id) {
				selectedTemplate = null;
				currentPassphrase = '';
				currentStrength = null;
			}
		}
	}

	// Get use case icon and color
	function getUseCaseStyle(useCase: string) {
		switch (useCase) {
			case 'personal':
				return { icon: '👤', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/50' };
			case 'work':
				return { icon: '💼', color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-500/50' };
			case 'high-security':
				return { icon: '🔒', color: 'text-red-400', bg: 'bg-red-900/20 border-red-500/50' };
			case 'shared':
				return { icon: '👥', color: 'text-green-400', bg: 'bg-green-900/20 border-green-500/50' };
			case 'temporary':
				return { icon: '⏰', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-500/50' };
			default:
				return { icon: '⚙️', color: 'text-gray-400', bg: 'bg-gray-900/20 border-gray-500/50' };
		}
	}

	// Format last used date
	function formatLastUsed(dateStr?: string): string {
		if (!dateStr) return 'Never used';
		
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	}

	onMount(() => {
		loadTemplates();
	});

	$: canSaveTemplate = templateForm.name.trim() && templateForm.selectedCategories.length > 0;
</script>

<svelte:head>
	<title>Password Templates - MemPhrase</title>
	<meta name="description" content="Save and manage password generation templates for different use cases. Create reusable profiles for personal, work, and high-security accounts." />
</svelte:head>

<main class="container mx-auto mt-1 flex max-w-6xl flex-col items-center gap-6 p-4 md:mt-3 md:p-6">
	<div class="flex items-center justify-center">
		<img src="/memphrase-logo.png" alt="MemPhrase Logo" class="h-12 w-12 md:h-16 md:w-16 mr-2" loading="lazy" />
		<h1 class="text-center text-4xl font-bold text-gray-100 md:text-5xl [text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.6)]">
			Password Templates
		</h1>
	</div>

	<p class="text-center text-gray-300 max-w-4xl">
		Save and reuse passphrase configurations for different scenarios. Create templates for personal accounts, 
		work systems, high-security applications, and more. Generate secure passphrases instantly with your preferred settings.
	</p>

	<!-- Generated Passphrase Display -->
	{#if currentPassphrase}
		<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-100">Generated Passphrase</h3>
				<span class="text-sm text-gray-400">
					From: {selectedTemplate?.name}
				</span>
			</div>
			
			<div class="flex items-center gap-3 mb-4">
				<button
					on:click={copyPassphrase}
					class="font-mono text-lg bg-slate-900 px-4 py-3 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition text-gray-200 text-left break-all flex-1 cursor-pointer"
					title="Click to copy"
				>
					{currentPassphrase}
				</button>
				
				<button
					on:click={copyPassphrase}
					class="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 font-medium"
				>
					Copy
				</button>
			</div>

			{#if currentStrength}
				<AnimatedStrengthMeter 
					strength={currentStrength} 
					hasError={false}
					showAnimation={true}
				/>
			{/if}
		</section>
	{/if}

	<!-- Templates Grid -->
	<section class="w-full">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-gray-100">Available Templates</h2>
			<button
				on:click={() => openCreateDialog()}
				class="button-gleam rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
			>
				Create Template
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each templates as template (template.id)}
				{@const style = getUseCaseStyle(template.useCase)}
				<div class="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl hover:shadow-2xl transition-shadow">
					<!-- Header -->
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center gap-3">
							<span class="text-2xl">{style.icon}</span>
							<div>
								<h3 class="text-lg font-semibold text-gray-100">{template.name}</h3>
								<span class="text-xs px-2 py-1 rounded-full {style.bg} {style.color}">
									{template.useCase.replace('-', ' ')}
								</span>
							</div>
						</div>
						
						{#if !builtInTemplates.find(bt => bt.id === template.id)}
							<div class="flex gap-1">
								<button
									on:click={() => openCreateDialog(template)}
									class="p-1 text-gray-400 hover:text-gray-200 transition"
									title="Edit template"
									aria-label="Edit template {template.name}"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button
									on:click={() => deleteTemplate(template)}
									class="p-1 text-gray-400 hover:text-red-400 transition"
									title="Delete template"
									aria-label="Delete template {template.name}"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						{/if}
					</div>

					<!-- Description -->
					<p class="text-sm text-gray-400 mb-4 leading-relaxed">{template.description}</p>

					<!-- Configuration Summary -->
					<div class="space-y-2 mb-4">
						<div class="text-xs text-gray-500 space-y-1">
							<div>Words: {template.options.numWords}, Separator: "{template.options.separator || 'none'}"</div>
							<div>Numbers: {template.options.numDigits}, Symbols: {template.options.numSymbols}</div>
							<div>Categories: {template.options.selectedCategories.length} selected</div>
						</div>
					</div>

					<!-- Statistics -->
					<div class="flex items-center justify-between text-xs text-gray-500 mb-4">
						<span>Used {template.usageCount} times</span>
						<span>{formatLastUsed(template.lastUsed)}</span>
					</div>

					<!-- Action Button -->
					<button
						on:click={() => generateFromTemplate(template)}
						disabled={isGenerating}
						class="w-full button-gleam rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isGenerating && selectedTemplate?.id === template.id ? 'Generating...' : 'Generate Password'}
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Template Creation/Editing Dialog -->
	{#if showCreateDialog}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div class="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-xl font-semibold text-gray-100">
						{editingTemplate ? 'Edit Template' : 'Create New Template'}
					</h3>
					<button
						on:click={() => showCreateDialog = false}
						class="p-2 text-gray-400 hover:text-gray-200 transition"
						aria-label="Close dialog"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="space-y-6">
					<!-- Basic Info -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="templateName" class="block text-sm font-medium text-gray-300 mb-2">Template Name *</label>
							<input 
								type="text" 
								id="templateName"
								bind:value={templateForm.name}
								placeholder="e.g., Social Media Accounts"
								class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
							/>
						</div>
						<div>
							<label for="useCase" class="block text-sm font-medium text-gray-300 mb-2">Use Case</label>
							<select 
								id="useCase"
								bind:value={templateForm.useCase}
								class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value="personal">Personal</option>
								<option value="work">Work</option>
								<option value="high-security">High Security</option>
								<option value="shared">Shared</option>
								<option value="temporary">Temporary</option>
								<option value="custom">Custom</option>
							</select>
						</div>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-gray-300 mb-2">Description</label>
						<textarea 
							id="description"
							bind:value={templateForm.description}
							placeholder="Describe when to use this template..."
							rows="2"
							class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
						></textarea>
					</div>

					<!-- Passphrase Configuration -->
					<div class="border-t border-slate-600 pt-6">
						<h4 class="text-lg font-medium text-gray-200 mb-4">Passphrase Configuration</h4>
						
						<div class="grid grid-cols-2 gap-4 mb-4">
							<div>
								<label for="numWords" class="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
								<select 
									id="numWords"
									bind:value={templateForm.options.numWords}
									class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
								>
									<option value={3}>3 words</option>
									<option value={4}>4 words</option>
									<option value={5}>5 words</option>
									<option value={6}>6 words</option>
								</select>
							</div>
							<div>
								<label for="separator" class="block text-sm font-medium text-gray-300 mb-2">Separator</label>
								<select 
									id="separator"
									bind:value={templateForm.options.separator}
									class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
								>
									<option value="-">Hyphen (-)</option>
									<option value="_">Underscore (_)</option>
									<option value=".">Period (.)</option>
									<option value=" ">Space ( )</option>
									<option value="">No separator</option>
								</select>
							</div>
							<div>
								<label for="numDigits" class="block text-sm font-medium text-gray-300 mb-2">Numbers</label>
								<select 
									id="numDigits"
									bind:value={templateForm.options.numDigits}
									class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
								>
									<option value={0}>None</option>
									<option value={1}>1 number</option>
									<option value={2}>2 numbers</option>
									<option value={3}>3 numbers</option>
									<option value={4}>4 numbers</option>
								</select>
							</div>
							<div>
								<label for="numSymbols" class="block text-sm font-medium text-gray-300 mb-2">Symbols</label>
								<select 
									id="numSymbols"
									bind:value={templateForm.options.numSymbols}
									class="block w-full rounded-md border-gray-500 bg-gray-700 text-sm text-white shadow-sm focus:border-green-500 focus:ring-green-500"
								>
									<option value={0}>None</option>
									<option value={1}>1 symbol</option>
									<option value={2}>2 symbols</option>
									<option value={3}>3 symbols</option>
									<option value={4}>4 symbols</option>
								</select>
							</div>
						</div>

						<label class="flex items-center gap-3 cursor-pointer mb-6">
							<input type="checkbox" bind:checked={templateForm.options.capitalize} class="rounded text-green-500 focus:ring-green-500" />
							<span class="text-sm text-gray-200">Capitalize Words</span>
						</label>

						<!-- Word Categories -->
						<div>
							<span class="block text-sm font-medium text-gray-300 mb-3">Word Categories</span>
							<div class="max-h-32 overflow-y-auto border border-slate-600 rounded p-3 bg-slate-700/30">
								{#each wordListCategories as parentCategory}
									{#if parentCategory.subCategories}
										<div class="mb-3">
											<h5 class="text-xs font-medium text-gray-400 mb-2">{parentCategory.name}</h5>
											<div class="grid grid-cols-3 gap-2 ml-2">
												{#each parentCategory.subCategories as subCategory}
													<label class="flex items-center gap-2 cursor-pointer text-xs">
														<input 
															type="checkbox" 
															bind:group={templateForm.options.selectedCategories} 
															value={subCategory.name}
															class="rounded text-green-500 focus:ring-green-500" 
														/>
														<span class="text-gray-200">{subCategory.name}</span>
													</label>
												{/each}
											</div>
										</div>
									{/if}
								{/each}
							</div>
							{#if templateForm.options.selectedCategories.length === 0}
								<p class="text-red-400 text-xs mt-1">Please select at least one word category</p>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex justify-end gap-3 pt-6 border-t border-slate-600">
						<button
							on:click={() => showCreateDialog = false}
							class="px-4 py-2 border border-slate-500 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
						>
							Cancel
						</button>
						<button
							on:click={saveTemplate}
							disabled={!canSaveTemplate}
							class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{editingTemplate ? 'Update Template' : 'Create Template'}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Info Section -->
	<section class="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
		<h3 class="text-lg font-semibold text-gray-100 mb-4">Template Benefits</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">🚀 Quick Generation</h4>
				<p class="text-sm text-gray-300">
					Generate passphrases instantly without reconfiguring settings each time. 
					Perfect for users with consistent security requirements.
				</p>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">🎯 Use Case Specific</h4>
				<p class="text-sm text-gray-300">
					Different security needs require different configurations. Save templates 
					for personal, work, and high-security scenarios.
				</p>
			</div>
			
			<div>
				<h4 class="text-md font-medium text-green-400 mb-2">📊 Track Usage</h4>
				<p class="text-sm text-gray-300">
					Monitor which templates you use most frequently and when they were 
					last used to optimize your password generation workflow.
				</p>
			</div>
		</div>

		<!-- Compatibility Note -->
		<div class="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/50">
			<h4 class="text-md font-medium text-yellow-400 mb-2">⚠️ Separator Compatibility</h4>
			<p class="text-sm text-yellow-300">
				<strong>Note:</strong> Some systems don't accept certain separators. 
				<strong>Spaces ( )</strong> and <strong>periods (.)</strong> may be rejected by some websites or applications. 
				<strong>Hyphens (-)</strong> and <strong>underscores (_)</strong> are most widely accepted.
			</p>
		</div>
	</section>

	<!-- Security Notice -->
	<div class="w-full text-center mt-8 mb-4">
		<p class="text-xs text-slate-500">
			Templates are stored locally in your browser. No data is transmitted to servers.
		</p>
	</div>

	<Footer />
</main> 