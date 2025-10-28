# 🚀 NPM Publishing Guide - WaQtor

## 📋 Overview

WaQtor uses **GitHub Actions** with **npm Trusted Publisher** for automated, secure publishing to npm.

---

## 🔐 Trusted Publisher Setup

### **What is Trusted Publisher?**

Trusted Publisher uses **OpenID Connect (OIDC)** to establish a secure connection between GitHub and npm, eliminating the need to store npm tokens as secrets.

### **Benefits:**
- ✅ **No npm tokens needed** - More secure
- ✅ **Automated publishing** - On release creation
- ✅ **Provenance** - Package authenticity verification
- ✅ **Environment protection** - Only authorized workflows can publish

---

## 🛠️ Setup Instructions

### **Step 1: Configure npm Trusted Publisher**

1. Go to [npmjs.com](https://www.npmjs.com/package/waqtor/access)
2. Navigate to **Settings** → **Publishing Access**
3. Click **Add Trusted Publisher**
4. Fill in the details:

```
Publisher: GitHub Actions
Organization or user: tariqsaidofficial
Repository: WaQtor
Workflow filename: publish.yml
Environment name: npm-publish
```

5. Click **Set up connection**

---

### **Step 2: Create GitHub Environment** (Optional but Recommended)

1. Go to GitHub Repository Settings
2. Navigate to **Environments**
3. Click **New environment**
4. Name it: `npm-publish`
5. Add protection rules:
   - ✅ Required reviewers (optional)
   - ✅ Wait timer (optional)
   - ✅ Deployment branches: Only `main` or `waqtor-dev`

---

### **Step 3: Verify Workflow**

The workflow file is located at `.github/workflows/publish.yml`

**Key features:**
- ✅ Runs on Release creation
- ✅ Can be triggered manually
- ✅ Runs tests before publishing
- ✅ Publishes with provenance
- ✅ Uses OIDC authentication

---

## 📦 Publishing Process

### **Method 1: Automated (Recommended)**

When you create a GitHub Release, the package is automatically published to npm.

**Steps:**

1. **Update version in `package.json`**
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   # or
   npm version minor  # 1.0.0 → 1.1.0
   # or
   npm version major  # 1.0.0 → 2.0.0
   ```

2. **Commit and push with tag**
   ```bash
   git add package.json
   git commit -m "🚀 Release v1.x.x"
   git push origin waqtor-dev --tags
   ```

3. **Create GitHub Release**
   - Go to: https://github.com/tariqsaidofficial/WaQtor/releases/new
   - Choose the tag (e.g., `v1.0.1`)
   - Fill in release notes
   - Click **Publish release**

4. **Workflow runs automatically**
   - GitHub Actions workflow triggers
   - Tests run
   - Package published to npm
   - ✅ Done!

---

### **Method 2: Manual Publishing**

If you need to publish without creating a release:

1. **Go to Actions tab**
   - https://github.com/tariqsaidofficial/WaQtor/actions

2. **Select "Publish to npm" workflow**

3. **Click "Run workflow"**
   - Choose branch: `waqtor-dev`
   - (Optional) Enter version
   - Click **Run workflow**

---

## 🔍 Verification

After publishing, verify:

### **Check npm**
```bash
npm view waqtor version
npm view waqtor

# Should show latest version
```

### **Check GitHub Actions**
- Go to: https://github.com/tariqsaidofficial/WaQtor/actions
- Verify the workflow ran successfully

### **Check npm Provenance**
- Go to: https://www.npmjs.com/package/waqtor
- Look for the **Provenance** badge
- Click to verify build information

---

## 🎯 Complete Release Workflow

### **Full process for new release:**

```bash
# 1. Ensure you're on waqtor-dev
git checkout waqtor-dev
git pull origin waqtor-dev

# 2. Make your changes
# ... code changes ...

# 3. Update version
npm version patch  # or minor/major

# 4. Update CHANGELOG.md
# Add changes to CHANGELOG.md

# 5. Commit and push
git add .
git commit -m "🚀 Release v1.0.1

- Fixed XYZ
- Added ABC
- Improved performance"

git push origin waqtor-dev --tags

# 6. Create GitHub Release
# Go to GitHub → Releases → New Release
# - Tag: v1.0.1
# - Title: WaQtor v1.0.1
# - Description: Copy from CHANGELOG
# - Publish release

# 7. Wait for GitHub Actions
# Workflow runs automatically
# Package published to npm

# 8. Verify
npm view waqtor version
```

---

## 🔐 Security

### **Environment Protection**

The `npm-publish` environment ensures:
- ✅ Only specific workflows can publish
- ✅ Optional manual approval required
- ✅ Only specific branches allowed
- ✅ Audit log of all publishes

### **OIDC Authentication**

- ✅ No long-lived tokens
- ✅ Temporary credentials per workflow run
- ✅ Automatic token rotation
- ✅ Better security than traditional tokens

### **Provenance**

Each published package includes:
- ✅ Build information
- ✅ Source repository link
- ✅ Commit SHA
- ✅ Workflow run link
- ✅ Cryptographic signature

---

## ⚠️ Troubleshooting

### **Workflow fails with "Forbidden"**

**Solution:** Verify Trusted Publisher setup on npm:
1. Check Organization/User name matches
2. Check Repository name matches
3. Check Workflow filename is exact: `publish.yml`
4. Check Environment name matches: `npm-publish`

### **No provenance badge on npm**

**Solution:** Ensure workflow uses:
```yaml
run: npm publish --provenance --access public
```

### **Tests fail during workflow**

The workflow is set to `continue-on-error: true` for tests. If you want strict testing:

```yaml
- name: Run tests
  run: npm test
  # Remove: continue-on-error: true
```

---

## 📊 Version Numbers

Follow **Semantic Versioning** (SemVer):

| Version Type | When to Use | Command | Example |
|--------------|-------------|---------|---------|
| **PATCH** | Bug fixes, small changes | `npm version patch` | 1.0.0 → 1.0.1 |
| **MINOR** | New features (backward-compatible) | `npm version minor` | 1.0.0 → 1.1.0 |
| **MAJOR** | Breaking changes | `npm version major` | 1.0.0 → 2.0.0 |

### **Pre-release versions:**

```bash
npm version 1.1.0-alpha.1    # Alpha
npm version 1.1.0-beta.1     # Beta
npm version 1.1.0-rc.1       # Release Candidate
```

---

## 📞 Support

For issues with publishing:

- **GitHub Issues:** https://github.com/tariqsaidofficial/WaQtor/issues
- **Email:** support@dxbmark.com
- **npm Support:** https://www.npmjs.com/support

---

## 📚 Resources

- [npm Trusted Publisher Docs](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

**Last Updated:** October 28, 2025  
**Current Version:** 1.0.0  
**Workflow:** `.github/workflows/publish.yml`
