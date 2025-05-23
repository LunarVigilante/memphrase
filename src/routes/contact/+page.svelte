<script lang="ts">
	// Removed: import { Recaptcha } from 'svelte-recaptcha-v2'; 
	import { PUBLIC_RECAPTCHA_V2_SITE_KEY } from '$env/static/public';
	import { browser } from '$app/environment'; 
	import { onMount } from 'svelte';

	let formStatusMessage = '';
	let formStatusIsError = false;
	let isLoading = false;
	let recaptchaToken: string | null = null;
	let recaptchaWidgetId: number | null = null; // To store the ID of the rendered widget for reset

	// Declare grecaptcha so TypeScript knows about it from the global scope (loaded by app.html)
	declare global {
	    interface Window {
	        grecaptcha: any; 
	    }
	}

	function renderRecaptcha() {
		if (browser && PUBLIC_RECAPTCHA_V2_SITE_KEY && window.grecaptcha && window.grecaptcha.render) {
			const recaptchaContainer = document.getElementById('recaptcha-widget-container');
			if (recaptchaContainer && recaptchaContainer.innerHTML.trim() === '') { // Render only if not already rendered
				try {
					recaptchaWidgetId = window.grecaptcha.render('recaptcha-widget-container', {
						'sitekey': PUBLIC_RECAPTCHA_V2_SITE_KEY,
						'theme': 'dark',
						'callback': (token: string) => {
							recaptchaToken = token;
							formStatusMessage = ''; // Clear any 'Please complete reCAPTCHA' message
							formStatusIsError = false;
						},
						'expired-callback': () => {
							recaptchaToken = null;
							// Optionally show a message that captcha expired
						},
						'error-callback': () => {
							recaptchaToken = null;
							formStatusMessage = 'reCAPTCHA failed to load. Please try refreshing.';
							formStatusIsError = true;
						}
					});
				} catch (e) {
					console.error("Error rendering reCAPTCHA: ", e);
					formStatusMessage = 'Could not load reCAPTCHA. Please check your connection or ad-blocker.';
					formStatusIsError = true;
				}
			}
		} else if (browser && !PUBLIC_RECAPTCHA_V2_SITE_KEY) {
			console.error('CRITICAL: reCAPTCHA Site Key is undefined or empty for direct API!');
			formStatusMessage = 'Error: reCAPTCHA configuration issue.';
			formStatusIsError = true;
		}
	}

	onMount(() => {
		console.log('Site Key from env (for direct API):', PUBLIC_RECAPTCHA_V2_SITE_KEY);
		if (browser) {
			// Check if grecaptcha is already available (e.g. script loaded quickly)
			if (window.grecaptcha && window.grecaptcha.render) {
				renderRecaptcha();
			} else {
				// If not, wait for it. Google's script usually defines onload callback but this is a fallback.
				const interval = setInterval(() => {
					if (window.grecaptcha && window.grecaptcha.render) {
						clearInterval(interval);
						renderRecaptcha();
					}
				}, 100);
			}
		}
	});

	function resetRecaptcha() {
		if (browser && window.grecaptcha && recaptchaWidgetId !== null) {
			window.grecaptcha.reset(recaptchaWidgetId);
		}
		recaptchaToken = null;
	}

	async function handleSubmit(event: SubmitEvent) {
		isLoading = true;
		formStatusMessage = '';
		formStatusIsError = false;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const email = formData.get('email') as string;
		const subject = formData.get('subject') as string;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			formStatusMessage = 'Please enter a valid email address.';
			formStatusIsError = true;
			isLoading = false;
			return;
		}
		if (!subject || subject.trim() === '') {
			formStatusMessage = 'Subject cannot be blank.';
			formStatusIsError = true;
			isLoading = false;
			return;
		}

		if (!recaptchaToken) {
			formStatusMessage = 'Please complete the reCAPTCHA.';
			formStatusIsError = true;
			isLoading = false;
			return;
		}
		formData.append('g-recaptcha-response', recaptchaToken);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				formStatusMessage = result.message || 'Message sent successfully!';
				formStatusIsError = false;
				form.reset();
				resetRecaptcha(); 
			} else {
				formStatusMessage = result.message || 'An error occurred.';
				formStatusIsError = true;
				resetRecaptcha();
			}
		} catch (error) {
			console.error('Form submission error:', error);
			formStatusMessage = 'A network error occurred. Please try again.';
			formStatusIsError = true;
			resetRecaptcha();
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Contact Us - MemPhrase</title>
	<meta name="description" content="Contact MemPhrase" />
</svelte:head>

<div class="container mx-auto max-w-xl p-4 md:p-6 text-slate-200">
	<h1 class="text-3xl font-bold text-slate-100 mb-6 text-center">Contact Us</h1>

	<p class="text-center text-slate-300 mb-8">
		Have questions or feedback? We'd love to hear from you.
	</p>

	<div class="bg-slate-800 p-6 md:p-8 rounded-lg shadow-xl">
		<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
			<div>
				<label for="name" class="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
				<input type="text" name="name" id="name" autocomplete="name" required class="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="Your Name">
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
				<input type="email" name="email" id="email" autocomplete="email" required class="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="you@example.com">
			</div>

			<div>
				<label for="subject" class="block text-sm font-medium text-slate-300 mb-1">Subject</label>
				<input type="text" name="subject" id="subject" required class="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="Question about MemPhrase">
			</div>

			<div>
				<label for="message" class="block text-sm font-medium text-slate-300 mb-1">Message</label>
				<textarea id="message" name="message" rows="4" required class="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="Your message..."></textarea>
			</div>

			<!-- Placeholder for Google reCAPTCHA widget -->
			<div id="recaptcha-widget-container" class="my-4 flex justify-center"></div> 

			<div class="pt-2">
				<button type="submit" 
						class="button-gleam w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-800"
						disabled={isLoading}
				>
					{isLoading ? 'Sending...' : 'Send Message'}
				</button>
			</div>
		</form>

		{#if formStatusMessage}
			<p class="mt-4 text-center text-sm {formStatusIsError ? 'text-red-400' : 'text-green-400'}">
				{formStatusMessage}
			</p>
		{/if}

		<div class="mt-12 text-center">
			<a href="/" class="text-green-400 hover:text-green-300 transition-colors">&#8592; Back to MemPhrase</a>
		</div>
	</div>
</div>

<style>
	/* Minimal specific styles, relying on Tailwind mostly */
</style> 