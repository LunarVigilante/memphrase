<svelte:head>
	<title>Password Guide - Understanding Security & MemPhrase - MemPhrase</title>
	<meta name="description" content="Learn about password strength, entropy, how MemPhrase generates passwords, general security tips, and password managers." />
</svelte:head>

<div class="container mx-auto max-w-3xl p-4 md:p-6 text-slate-200">
	<div class="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6 md:p-8">
		<div class="prose prose-invert prose-sm md:prose-base max-w-none">
			<h1 class="text-3xl font-bold text-slate-100 mb-6 text-center">Password Security & MemPhrase</h1>

			<h2 class="text-2xl font-semibold text-slate-100 mt-8 mb-4">Understanding Password Strength & Entropy</h2>
			<p>
				A strong password is one that is difficult for humans or computers to guess. The strength of a password is often measured in <strong class="text-emerald-400">entropy</strong>, which is expressed in "bits." The higher the entropy, the more unpredictable and secure your password is.
			</p>
			<p>
				Entropy considers two main factors:
			</p>
			<ul class="list-disc pl-5 space-y-1 mb-4">
				<li><strong>Length:</strong> Longer passwords have significantly more entropy. Each additional character increases the number of possible combinations exponentially.</li>
				<li><strong>Character Set Size:</strong> This is the pool of unique characters used to create the password. A password using lowercase letters (26 options), uppercase letters (26), numbers (10), and symbols (e.g., ~28-32 common ones) has a much larger character set than one using only lowercase letters.</li>
			</ul>
			<p>
				For example, a password of length <code>L</code> using a character pool of size <code>N</code> has an entropy of <code>L * log₂(N)</code> bits. MemPhrase calculates and displays this value to help you gauge the generated password's theoretical strength based on the options you select.
			</p>

			<h2 class="text-2xl font-semibold text-slate-100 mt-8 mb-4">How MemPhrase Generates Passwords</h2>
			<h3 class="text-xl font-semibold text-slate-100 mt-6 mb-3">1. Word-based (Memorable Passphrases)</h3>
			<p>
				This mode focuses on creating passphrases that are easier for humans to remember while still maintaining good strength. It works by:
			</p>
			<ul class="list-disc pl-5 space-y-1 mb-4">
				<li>Selecting a specified number of words from chosen categories (e.g., adjectives, nouns, verbs). The diversity and size of the word lists in these categories contribute to entropy.</li>
				<li>Optionally capitalizing each word (adds 1 bit of entropy per word if chosen).</li>
				<li>Joining words with a chosen separator character.</li>
				<li>Optionally adding a specified number of random digits (0-9) and symbols (from a customizable set). Each digit adds log₂(10) bits, and each symbol adds log₂(SymbolSetSize) bits.</li>
				<li>The position and grouping of these numbers and symbols can also be configured.</li>
			</ul>
			<p>
				The goal is to balance memorability with cryptographic strength. Longer passphrases with more words and added random elements are stronger.
			</p>

			<h3 class="text-xl font-semibold text-slate-100 mt-6 mb-3">2. Random Characters (Strong Passwords)</h3>
			<p>
				This mode generates passwords that are typically harder to remember but can achieve very high entropy for their length. It works by:
			</p>
			<ul class="list-disc pl-5 space-y-1 mb-4">
				<li>Creating a character pool based on your selections: lowercase letters (a-z), uppercase letters (A-Z), numbers (0-9), and symbols (from a default set of ~28 or your customized set).</li>
				<li>Randomly selecting characters from this pool to construct a password of your desired length (between 8 and 128 characters).</li>
			</ul>
			<p>
				The strength of these passwords directly depends on the length and the size of the character pool used. For instance, including all character types creates a larger pool (e.g., 26+26+10+28 = 90 characters) than using only lowercase and numbers (26+10 = 36 characters).
			</p>

			<h2 class="text-2xl font-semibold text-slate-100 mt-8 mb-4">General Password Security Tips</h2>
			<ul class="list-disc pl-5 space-y-2 mb-6">
				<li>
					<strong>Use Strong, Unique Passwords for Each Account:</strong> This is crucial. If one account is compromised, unique passwords prevent attackers from accessing your other accounts.
				</li>
				<li>
					<strong>Length Matters Most:</strong> After ensuring a good mix of character types, increasing length provides the biggest boost to security.
				</li>
				<li>
					<strong>Enable Two-Factor/Multi-Factor Authentication (2FA/MFA):</strong> This adds a critical second layer of security beyond just your password.
				</li>
				<li>
					<strong>Avoid Obvious Information:</strong> Don't use names, birthdays, pet names, or common dictionary words as standalone passwords.
				</li>
				<li>
					<strong>Be Wary of Phishing:</strong> Never enter your password on a site you reached via a suspicious link. Always verify the website's address (URL).
				</li>
				<li>
					<strong>Keep Software Updated:</strong> Regular updates for your OS, browser, and applications often include security patches.
				</li>
				<li>
					<strong>Consider Passkeys When Available:</strong> Passkeys are a newer, more secure alternative to passwords that use cryptographic key pairs. They are resistant to phishing and don't require you to remember complex strings. Look for options to use passkeys on websites and apps that support them for the best security.
				</li>
			</ul>

			<h2 class="text-2xl font-semibold text-slate-100 mt-8 mb-4">Using Password Managers</h2>
			<p>
				Given the need for long, unique, and complex passwords for every account, using a <strong class="text-emerald-400">password manager</strong> is highly recommended. These tools securely generate and store your passwords, so you only need to remember one master password (make it a very strong one!).
			</p>
			<h3 class="text-xl font-semibold text-slate-100 mt-6 mb-3">Popular Password Managers:</h3>
			<p>
				Below are some well-regarded password managers. We encourage you to research them to find one that fits your needs:
			</p>
			<ul class="list-disc pl-5 space-y-1 mb-6">
				<li><a href="https://bitwarden.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">Bitwarden</a> (Open source, widely recommended)</li>
				<li><a href="https://1password.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">1Password</a> (Personally recommended)</li>
				<li><a href="https://www.dashlane.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">Dashlane</a></li>
				<li><a href="https://www.lastpass.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">LastPass</a></li>
				<li><a href="https://www.keepersecurity.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">Keeper</a></li>
			</ul>
			<p class="text-sm text-slate-400">
				<em>Disclaimer: The listing of these password managers is for informational purposes only and does not constitute an endorsement by MemPhrase. Please conduct your own research before choosing any security product.</em>
			</p>
		</div>
		<div class="mt-10 text-center">
			<a href="/" class="text-green-400 hover:text-green-300 transition-colors">&#8592; Back to MemPhrase</a>
		</div>
	</div>
</div>

<style>
	/* Basic styling for prose content */
	.prose h1, .prose h2, .prose h3 {
		margin-bottom: 0.5em;
	}
	.prose p, .prose ul {
		margin-bottom: 1em;
		line-height: 1.6;
	}
	.prose ul {
		padding-left: 1.5em;
	}
	.prose strong.text-emerald-400 {
		color: #34d399; /* Ensure this matches your Tailwind config for emerald-400 if prose overrides it */
	}
	.prose code {
		background-color: #374151; /* bg-slate-700 */
		color: #f3f4f6; /* text-slate-100 */
		padding: 0.1em 0.4em;
		border-radius: 0.25rem;
		font-size: 0.9em;
	}
	.prose a {
		color: #34d399; /* emerald-400 */
		text-decoration: none;
	}
	.prose a:hover {
		color: #6ee7b7; /* emerald-300 */
		text-decoration: underline;
	}
</style> 