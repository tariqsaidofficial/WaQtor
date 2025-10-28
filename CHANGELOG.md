# Changelog

All notable changes to WaQtor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Admin dashboard (React + PrimeReact)
- Webhooks support (delivered / read / failed)
- Multi-session management
- Template library with variables
- Analytics & CSV export

## [1.0.1] - 2025-10-28

### Fixed
- 🐛 **npm Package Size** - Reduced from 76.6 MB to 489.4 kB
- 🔒 **Security** - Removed session files from published package
- 📦 **Package Quality** - Optimized .npmignore to exclude runtime data

### Changed
- Updated .npmignore to exclude `runtime/server/session/`
- Updated .npmignore to exclude `runtime/server/db/*.db`
- Cleaned package contents for production use

### Package Info
- **npm Package**: [waqtor@1.0.1](https://www.npmjs.com/package/waqtor)
- **Package Size**: 112.7 kB (compressed), 489.4 kB (unpacked)
- **Total Files**: 73

## [1.0.0] - 2025-10-28

### Added
- ✨ **Initial Release** - First stable version of WaQtor
- 🚀 **REST API Layer** - Express.js-based HTTP endpoints
- 📊 **Campaign Management** - Create, track, and execute messaging campaigns
- 🗄️ **SQLite Integration** - Persistent storage for campaigns and logs
- 🐳 **Docker Support** - Production-ready containerization
- 🔒 **API Authentication** - Secure API key-based access control
- ⚡ **Rate Limiting** - Protection against API abuse
- 📝 **Logging System** - Winston-based comprehensive logging
- 🏥 **Health Checks** - System monitoring endpoints
- 📚 **Documentation** - Complete guides and API reference
- 🔐 **GitHub Actions** - CI/CD workflow for npm publishing

### Changed
- Rebranded to **WaQtor** - Smart Automation Engine for WhatsApp
- Complete README.md restructure with new branding
- Added Core Architecture documentation
- Added Design System (DXBMark Style)
- Added REST API specifications
- Updated all repository links to github.com/tariqsaidofficial/WaQtor
- Updated license attribution

### Original Base
- Based on [whatsapp-web.js v1.34.1](https://github.com/pedroslopez/whatsapp-web.js) by Pedro S. Lopez
- License: Apache 2.0

### Maintained By
- Tariq Said (DXBMark) - [GitHub](https://github.com/tariqsaidofficial) | [npm](https://www.npmjs.com/~tariqsaidofficial)

---

## Original Changelog (whatsapp-web.js)

For the original project's changelog, visit:
https://github.com/pedroslopez/whatsapp-web.js/releases
