# 🔐 MemPhrase - Advanced Password & Security Tools

A modern, privacy-first password generation and security toolkit built with SvelteKit. Generate secure passphrases, analyze password strength, manage templates, and access comprehensive security tools - all locally in your browser.

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://memphrase.vercel.app/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)](https://kit.svelte.dev/)

## ✨ Features

### 🎲 **Password Generation Tools**
- **[Passphrase Generator](https://memphrase.vercel.app/)** - Create secure, memorable passphrases using word combinations
  - 15+ word categories (Animals, Technology, Science, Nature, etc.)
  - Customizable word count (3-6 words)
  - Multiple separators (hyphens, underscores, periods, spaces, none)
  - Add numbers and symbols for enhanced security
  - Real-time strength analysis with entropy calculation
  - Multiple generation modes and character grouping options

- **[Bulk Generator](https://memphrase.vercel.app/bulk-generator)** - Generate 10-100 passwords simultaneously
  - Batch generation with real-time progress tracking
  - Full customization of all passphrase parameters
  - Export options: TXT, CSV, JSON formats
  - Individual and bulk copy functionality
  - Average strength calculation and statistics

- **[Password Templates](https://memphrase.vercel.app/password-templates)** - Save and reuse password configurations
  - 5 built-in templates (Personal, Work, High-Security, Shared, Temporary)
  - Create unlimited custom templates
  - Usage tracking and statistics
  - Template-based instant generation
  - Separator compatibility warnings for better system support

### 📊 **Security Analysis Tools**
- **[Password History](https://memphrase.vercel.app/password-history)** - Track your last 20 generated passwords
  - Automatic history tracking with timestamps
  - Search and filter capabilities
  - Strength analysis for each password
  - Individual copy and delete functions
  - Usage statistics and patterns analysis
  - Privacy-first: all data stored locally

- **[Password Analyzer](https://memphrase.vercel.app/password-analyzer)** - Comprehensive password security analysis
  - Real-time strength analysis with detailed feedback
  - Pattern detection (sequential, keyboard, repeated characters)
  - Character composition analysis
  - Weakness identification and improvement suggestions
  - Common password fragment detection
  - Privacy-focused: all analysis performed locally

### 🔑 **Professional Security Tools**
- **[Secret Key Generator](https://memphrase.vercel.app/secret-key-generator)** - Generate cryptographic keys
  - Multiple security levels (Standard, High, Maximum, Custom)
  - Various key purposes (API, Database, Encryption, JWT, Session)
  - Hex and Base64 encoding options
  - Key lengths from 128 to 512 bits
  - Cryptographically secure random generation

- **[SSH Key Generator](https://memphrase.vercel.app/ssh-key-generator)** - Create SSH key pairs
  - Multiple algorithms (RSA, ECDSA, Ed25519)
  - Configurable key sizes and security levels
  - Passphrase protection options
  - Public/private key pair generation
  - Ready-to-use SSH key formats

### 🛡️ **Advanced Security Suite**
- **[TOTP Generator](https://memphrase.vercel.app/totp-generator)** - Two-Factor Authentication setup
  - Generate TOTP secrets for 2FA apps
  - QR code generation for easy mobile setup
  - Manual entry codes for authenticator apps
  - Multiple encoding formats (Base32, Hex)
  - Compatible with Google Authenticator, Authy, etc.

- **[Recovery Codes](https://memphrase.vercel.app/recovery-codes)** - Backup authentication codes
  - Generate 6-20 one-time recovery codes
  - Traditional alphanumeric format
  - **NEW**: Word-based codes for easier typing
  - Configurable word count (2-4 words) and separators
  - Usage tracking and secure download options

- **[UUID Generator](https://memphrase.vercel.app/uuid-generator)** - Universal identifiers
  - UUID v4 (random) and v7 (timestamp-based)
  - Bulk generation with export options
  - Uppercase/lowercase formatting
  - Copy individual or bulk UUIDs
  - Multiple output formats

- **[Checksum Generator](https://memphrase.vercel.app/checksum-generator)** - File integrity verification
  - Support for MD5, SHA-1, SHA-256, SHA-512
  - File upload and text input options
  - Bulk checksum generation
  - Compare checksums for verification
  - Download results in multiple formats

- **[Certificate Generator](https://memphrase.vercel.app/certificate-generator)** - SSL/TLS certificates
  - Self-signed certificate creation
  - Configurable validity periods
  - Multiple key algorithms and sizes
  - Subject information customization
  - PEM format output for immediate use

## 🚀 Quick Start

### Live Demo
Visit **[memphrase.vercel.app](https://memphrase.vercel.app/)** to use MemPhrase instantly - no installation required!

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/LunarVigilante/memphrase.git
   cd memphrase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔒 Privacy & Security

- **🔐 Client-Side Only**: All password generation and analysis happens locally in your browser
- **📡 No Data Transmission**: Your passwords and sensitive data never leave your device
- **🗄️ Local Storage**: Settings and history stored only in your browser's local storage
- **🔄 No Tracking**: No analytics, cookies, or user tracking
- **⚡ Offline Ready**: Core functionality works without internet connection
- **🛡️ CSP Protected**: Content Security Policy prevents code injection attacks

## 🛠️ Technology Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) - Modern full-stack framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Deployment**: [Vercel](https://vercel.com/) - Serverless deployment platform
- **Cryptography**: Web Crypto API - Browser-native secure random generation

## 📁 Project Structure

```
src/
├── routes/                     # SvelteKit pages
│   ├── +page.svelte           # Main passphrase generator
│   ├── bulk-generator/        # Bulk password generation
│   ├── password-templates/    # Template management
│   ├── password-history/      # Password tracking
│   ├── password-analyzer/     # Security analysis
│   ├── secret-key-generator/  # Cryptographic keys
│   ├── ssh-key-generator/     # SSH key pairs
│   ├── totp-generator/        # 2FA setup
│   ├── recovery-codes/        # Backup codes
│   ├── uuid-generator/        # UUID generation
│   ├── checksum-generator/    # File checksums
│   └── certificate-generator/ # SSL certificates
├── lib/
│   ├── components/            # Reusable Svelte components
│   ├── words/                 # Word lists for passphrases
│   └── passwordUtils.ts       # Core password generation logic
└── static/                    # Static assets
```

## 🎯 Roadmap

### Phase 1: Core Enhancements ✅
- [x] Enhanced Security Tools Suite
- [x] Advanced Password Features
- [x] PWA Implementation (90% complete)

### Phase 2: Platform Expansion 🚧
- [ ] Browser Extension (Chrome, Firefox, Safari)
- [ ] Mobile App (React Native)
- [ ] Desktop App (Electron)
- [ ] API Development with rate limiting

### Phase 3: Advanced Features 🔄
- [ ] Pronounceable password generation
- [ ] AI-powered security suggestions
- [ ] Breach intelligence integration
- [ ] Enterprise compliance modes

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature-name`
6. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add JSDoc comments for complex functions
- Test all features across browsers
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Word lists curated from various open-source dictionaries
- Icons from [Heroicons](https://heroicons.com/)
- Inspired by modern security best practices
- Built with love for the open-source community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/LunarVigilante/memphrase/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/LunarVigilante/memphrase/discussions)
- **Security**: Please report security issues privately

---

<div align="center">

**🔐 Generate. Secure. Protect.**

Made with ❤️ by the MemPhrase team

[Live Demo](https://memphrase.vercel.app/) • [Documentation](https://github.com/LunarVigilante/memphrase/wiki) • [Contributing](CONTRIBUTING.md)

</div>
