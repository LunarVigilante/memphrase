<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full max-w-4xl mx-auto py-12 mt-6 border-t border-slate-700">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
		<!-- Tools Section -->
		<div class="text-center">
			<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Tools</h3>
			<div class="space-y-2">
				<a href="/" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Passphrase Generator</a>
				<a href="/secret-key-generator" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Secret Key Generator</a>
				<a href="/ssh-key-generator" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">SSH Key Generator</a>
			</div>
		</div>

		<!-- Resources Section -->
		<div class="text-center">
			<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Resources</h3>
			<div class="space-y-2">
				<a href="/password-guide" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Password Guide</a>
				<a href="/security-tips" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Security Tips</a>
			</div>
		</div>

		<!-- Support Section -->
		<div class="text-center">
			<h3 class="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Support</h3>
			<div class="space-y-2">
				<a href="/contact" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Contact Us</a>
				<a href="/donate" class="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Donate</a>
				<a href="https://github.com/LunarVigilante/memphrase" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4">
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.236 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
					</svg>
					GitHub
				</a>
			</div>
		</div>
	</div>

	<!-- Bottom Section -->
	<div class="border-t border-slate-700 pt-6 text-center">
		<div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
			<div class="flex gap-6 text-xs">
				<a href="/terms" class="text-slate-400 hover:text-slate-200 transition-colors">Terms of Service</a>
				<a href="/privacy" class="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</a>
			</div>
		</div>
		<p class="text-xs text-slate-500">
			&copy; {currentYear} MemPhrase. All rights reserved.
		</p>
	</div>
</footer> 