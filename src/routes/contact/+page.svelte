<script lang="ts">
	let formStatusMessage = '';
	let formStatusIsError = false;
	let isLoading = false;

	async function handleSubmit(event: SubmitEvent) {
		isLoading = true;
		formStatusMessage = '';
		formStatusIsError = false;
		// event.preventDefault(); // Not strictly needed with SvelteKit form actions, but good practice for client-side handling

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Client-side validation (mirroring some backend validation for better UX)
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

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				formStatusMessage = result.message || 'Message sent successfully!';
				formStatusIsError = false;
				form.reset(); // Clear the form on success
			} else {
				formStatusMessage = result.message || 'An error occurred.';
				formStatusIsError = true;
			}
		} catch (error) {
			console.error('Form submission error:', error);
			formStatusMessage = 'A network error occurred. Please try again.';
			formStatusIsError = true;
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