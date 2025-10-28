# 📌 WaQtor Versioning Strategy

## 🎯 Overview

**WaQtor** follows **Semantic Versioning** (SemVer) to ensure clear, predictable version management for users and contributors.

---

## 📖 Semantic Versioning Format

```
MAJOR.MINOR.PATCH
```

### **Version Components:**

| Component | When to Increment | Example |
|-----------|-------------------|---------|
| **MAJOR** | Breaking changes, incompatible API changes | `1.0.0` → `2.0.0` |
| **MINOR** | New features (backward-compatible) | `1.0.0` → `1.1.0` |
| **PATCH** | Bug fixes, security patches | `1.0.0` → `1.0.1` |

---

## 🏗️ WaQtor Base Foundation

**WaQtor** is built on top of the original **whatsapp-web.js** library:

- **Original Project:** [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- **Original Author:** Pedro S. Lopez ([@pedroslopez](https://github.com/pedroslopez))
- **Base Version:** v1.34.1 (Last upstream sync)
- **Fork Date:** October 28, 2025

### **Why Independent Versioning?**

WaQtor is **not** a direct copy of whatsapp-web.js. It's a **complete framework** with:

- ✨ REST API Layer (Express.js)
- 📊 Campaign Management System
- 🗄️ SQLite Database Integration
- 🐳 Docker Deployment
- 🔒 API Authentication & Security
- ⚡ Rate Limiting & Middleware
- 📈 Analytics & Tracking

Therefore, WaQtor uses **independent versioning** starting from `v1.0.0`.

---

## 📊 Version History

### **Current Version: 1.0.0** (October 28, 2025)

#### **What's Included:**
- ✅ Full whatsapp-web.js v1.34.1 core functionality
- ✅ REST API for WhatsApp automation
- ✅ Campaign management system
- ✅ SQLite database integration
- ✅ Docker containerization
- ✅ API key authentication
- ✅ Rate limiting & security middleware
- ✅ Comprehensive documentation
- ✅ Health check endpoints
- ✅ Message tracking & logging

#### **Breaking Changes from whatsapp-web.js:**
- 🔄 Architecture: Added REST API layer
- 🔄 Database: Introduced SQLite for persistence
- 🔄 Deployment: Docker-first approach
- 🔄 Authentication: API key-based auth system

---

## 🔄 Upstream Synchronization

WaQtor maintains a connection with the original **whatsapp-web.js** project to receive:
- 🐛 Bug fixes
- 🔒 Security patches
- ⚡ Performance improvements
- 🆕 Core WhatsApp Web features

### **Sync Strategy:**

```
┌─────────────────────────────────────┐
│  whatsapp-web.js (Upstream)         │
│  By: Pedro S. Lopez                 │
│  Current: v1.34.1                   │
└─────────────────┬───────────────────┘
                  │
                  │ Selective merge
                  │ (monthly/quarterly)
                  ▼
┌─────────────────────────────────────┐
│  WaQtor                             │
│  By: Tariq Said                     │
│  Current: v1.0.0                    │
└─────────────────────────────────────┘
```

### **When to Sync:**

| Priority | Action | Timeline |
|----------|--------|----------|
| 🔴 **Critical** | Security patches, critical bugs | Immediate |
| 🟡 **High** | Important features, bug fixes | Monthly |
| 🟢 **Low** | Minor improvements, optimizations | Quarterly |

---

## 📋 Release Workflow

### **1. Planning Phase**

- Decide on features/fixes for the release
- Create milestone on GitHub
- Update documentation

### **2. Development Phase**

```bash
# Create feature branch
git checkout waqtor-dev
git checkout -b feature/new-feature

# Develop & test
# ...

# Merge to waqtor-dev
git checkout waqtor-dev
git merge feature/new-feature
```

### **3. Version Bump**

```bash
# For PATCH (bug fixes)
npm version patch  # 1.0.0 → 1.0.1

# For MINOR (new features)
npm version minor  # 1.0.0 → 1.1.0

# For MAJOR (breaking changes)
npm version major  # 1.0.0 → 2.0.0
```

### **4. Release Preparation**

1. Update `CHANGELOG.md` with changes
2. Update `README.md` if needed
3. Run tests: `npm test`
4. Build Docker image: `npm run docker:build`
5. Test locally

### **5. Publish**

```bash
# Commit version bump
git add package.json CHANGELOG.md
git commit -m "🚀 Release v1.x.x"

# Create Git tag
git tag -a v1.x.x -m "Release v1.x.x"

# Push to GitHub
git push origin waqtor-dev --tags

# Publish to npm
npm publish

# Create GitHub Release
# (via GitHub UI with release notes)
```

---

## 🎯 Version Numbering Examples

### **Patch Releases (Bug Fixes)**

```
v1.0.0 → v1.0.1
- 🐛 Fix session timeout issue
- 🐛 Fix media upload error
- 🔒 Security patch for dependencies
```

### **Minor Releases (New Features)**

```
v1.0.0 → v1.1.0
- ✨ Add bulk message scheduling
- ✨ Add message templates
- ✨ Add webhook support
- 🐛 Various bug fixes
```

### **Major Releases (Breaking Changes)**

```
v1.0.0 → v2.0.0
- 💥 BREAKING: Changed API authentication method
- 💥 BREAKING: Database schema changes
- 💥 BREAKING: Removed deprecated endpoints
- ✨ Major architecture overhaul
- ✨ New features...
```

---

## 📅 Release Schedule

| Type | Frequency | Example |
|------|-----------|---------|
| **Patch** | As needed (urgent fixes) | v1.0.1, v1.0.2 |
| **Minor** | Monthly/Bi-monthly | v1.1.0, v1.2.0 |
| **Major** | Yearly or when needed | v2.0.0, v3.0.0 |

---

## 🔖 Pre-release Versions

For beta testing and early access:

```
v1.1.0-alpha.1    # Alpha releases (internal testing)
v1.1.0-beta.1     # Beta releases (public testing)
v1.1.0-rc.1       # Release candidates (final testing)
v1.1.0            # Stable release
```

**Usage:**

```bash
# Publish alpha
npm version 1.1.0-alpha.1
npm publish --tag alpha

# Publish beta
npm version 1.1.0-beta.1
npm publish --tag beta

# Publish stable
npm version 1.1.0
npm publish --tag latest
```

---

## 📝 Version Metadata

### **In `package.json`:**

```json
{
  "name": "waqtor",
  "version": "1.0.0",
  "description": "Built on whatsapp-web.js v1.34.1 by Pedro S. Lopez",
  "waqtor": {
    "upstreamVersion": "1.34.1",
    "upstreamAuthor": "Pedro S. Lopez",
    "upstreamRepo": "https://github.com/pedroslopez/whatsapp-web.js",
    "lastSync": "2025-10-28"
  }
}
```

### **In Code:**

```javascript
// src/util/Constants.js
const WAQtorVersion = '1.0.0';
const UpstreamVersion = '1.34.1';
const UpstreamAuthor = 'Pedro S. Lopez';

module.exports = {
  WAQtorVersion,
  UpstreamVersion,
  UpstreamAuthor,
  // ...
};
```

---

## 🔍 Version Checking

### **For Users:**

```bash
# Check WaQtor version
npm list waqtor

# Check installed version
node -e "console.log(require('waqtor/package.json').version)"
```

### **In Code:**

```javascript
const { WAQtorVersion } = require('waqtor');
console.log(`WaQtor v${WAQtorVersion}`);

// Via API
GET /api/status
{
  "waqtor_version": "1.0.0",
  "upstream_version": "1.34.1",
  "upstream_author": "Pedro S. Lopez"
}
```

---

## ⚠️ Deprecation Policy

When deprecating features:

1. **Announce** in CHANGELOG and documentation
2. **Mark** with `@deprecated` in code
3. **Warn** in console when used
4. **Remove** in next major version

**Example Timeline:**

```
v1.5.0 - Feature marked as deprecated (warnings shown)
v1.6.0 - Still available with warnings
v2.0.0 - Feature removed (breaking change)
```

---

## 🆘 Version Support

| Version | Status | Support |
|---------|--------|---------|
| **1.x.x** | ✅ Active | Full support, updates, security patches |
| **0.x.x** | ❌ Unsupported | No support (pre-release) |

**Support Duration:**
- Latest major version: **Active support**
- Previous major version: **Security patches only** (6 months)
- Older versions: **No support**

---

## 📚 Resources

- **Semantic Versioning Spec:** <https://semver.org/>
- **npm Versioning:** <https://docs.npmjs.com/about-semantic-versioning>
- **GitHub Releases:** <https://docs.github.com/en/repositories/releasing-projects-on-github>
- **Conventional Commits:** <https://www.conventionalcommits.org/>

---

## 📞 Questions?

For version-related questions:
- **Email:** support@dxbmark.com
- **GitHub Issues:** <https://github.com/tariqsaidofficial/WaQtor/issues>

---

**Last Updated:** October 28, 2025  
**Current Version:** 1.0.0  
**Upstream Base:** whatsapp-web.js v1.34.1 by Pedro S. Lopez
