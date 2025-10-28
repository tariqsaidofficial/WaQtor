# npm Trusted Publisher Setup Guide

## 🔐 **What is npm Trusted Publisher?**

npm Trusted Publisher uses **OpenID Connect (OIDC)** to establish a secure trust relationship between your npm package and your GitHub repository. This eliminates the need for long-lived npm tokens and provides supply chain security through provenance attestations.

---

## ✅ **Prerequisites**

Before setting up npm Trusted Publisher, ensure:

1. ✅ You have **owner** or **admin** access to the npm package `waqtor`
2. ✅ You have **admin** access to the GitHub repository `tariqsaidofficial/WaQtor`
3. ✅ The package has been published at least once to npm
4. ✅ The `.github/workflows/publish.yml` file is configured correctly

---

## 📋 **Step-by-Step Setup on npmjs.com**

### **Step 1: Log in to npmjs.com**

1. Go to https://www.npmjs.com/
2. Sign in with your account
3. Navigate to your package: https://www.npmjs.com/package/waqtor

### **Step 2: Access Trusted Publisher Settings**

1. Click on **Settings** tab in your package page
2. Scroll down to **Publishing access**
3. Click on **Trusted Publishers** section
4. Click **Add a Trusted Publisher**

### **Step 3: Fill in the Form**

Fill in the form with these **exact values**:

| Field | Value |
|-------|-------|
| **Publisher** | GitHub Actions |
| **Organization or user** | `tariqsaidofficial` |
| **Repository** | `WaQtor` |
| **Workflow filename** | `publish.yml` |
| **Environment name** | `npm-publish` |

#### Form Details:

```
Package: waqtor
Publisher: GitHub Actions
Organization or user: tariqsaidofficial
Repository: WaQtor
Workflow filename: publish.yml
Environment name: npm-publish
```

> ⚠️ **Important Notes:**
> - The workflow filename is **ONLY** the filename (e.g., `publish.yml`), not the full path
> - The environment name `npm-publish` matches the environment defined in the workflow
> - Case-sensitive! Make sure to use exact capitalization

### **Step 4: Set up Connection**

1. Click **Set up connection**
2. Verify the details are correct
3. Confirm the setup

---

## 🔧 **GitHub Environment Configuration**

### **Step 1: Create GitHub Environment**

1. Go to your GitHub repository: https://github.com/tariqsaidofficial/WaQtor
2. Click **Settings** → **Environments**
3. Click **New environment**
4. Name: `npm-publish`
5. Click **Configure environment**

### **Step 2: Add Protection Rules (Recommended)**

For additional security, configure:

1. **Required reviewers**: Add trusted maintainers who can approve publishes
2. **Wait timer**: Add a delay before deployment (e.g., 5 minutes)
3. **Deployment branches**: Limit to specific branches (e.g., `main`, `waqtor-dev`)

### **Step 3: Remove Old NPM_TOKEN Secret (Optional)**

Once Trusted Publisher is working:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Find `NPM_TOKEN` secret
3. Click **Remove** (since it's no longer needed)

---

## 🚀 **Testing the Setup**

### **Option 1: Create a GitHub Release**

1. Go to your repository
2. Click **Releases** → **Create a new release**
3. Set tag version (e.g., `v1.0.1`)
4. Fill in release notes
5. Click **Publish release**
6. The workflow will trigger automatically

### **Option 2: Manual Workflow Dispatch**

1. Go to **Actions** tab
2. Click on **Publish to npm** workflow
3. Click **Run workflow**
4. Select branch (e.g., `main`)
5. Click **Run workflow**

### **Expected Result:**

```bash
✅ Checkout code
✅ Setup Node.js
✅ Install dependencies
✅ Run tests
✅ Get version
✅ Publish to npm with provenance
   📦 Publishing WaQtor v1.0.x
   npm notice publishing with provenance
   + waqtor@1.0.x
```

---

## 🔍 **Verification**

### **1. Verify Provenance**

After publishing, verify provenance on npm:

```bash
npm info waqtor --json | jq .dist.attestations
```

Or visit: https://www.npmjs.com/package/waqtor?activeTab=code

Look for **"Published with provenance"** badge.

### **2. Check GitHub Actions Logs**

1. Go to **Actions** tab
2. Click on the latest **Publish to npm** run
3. Check for successful completion
4. Verify no authentication errors

### **3. Test Installation**

```bash
# Create a test directory
mkdir test-waqtor && cd test-waqtor
npm init -y

# Install the package
npm install waqtor

# Verify installation
node -e "console.log(require('waqtor'))"
```

---

## 🛡️ **Security Benefits**

### **With npm Trusted Publisher:**

✅ **No long-lived tokens** - OIDC tokens expire quickly
✅ **Provenance attestations** - Verifiable supply chain security
✅ **GitHub environment protection** - Additional approval gates
✅ **Audit trail** - Full transparency of who published what
✅ **Reduced attack surface** - No tokens to leak or steal

### **Traditional NPM_TOKEN:**

❌ Long-lived tokens can be leaked
❌ No provenance information
❌ Token rotation is manual
❌ Less transparency

---

## ❓ **Troubleshooting**

### **Error: ENEEDAUTH**

**Problem:** Workflow fails with authentication error

**Solution:**
1. Verify Trusted Publisher is set up on npmjs.com
2. Check workflow has `permissions: id-token: write`
3. Ensure environment name matches (`npm-publish`)
4. Remove `NODE_AUTH_TOKEN` from workflow if present

### **Error: Invalid Workflow**

**Problem:** npm rejects the publish request

**Solution:**
1. Verify workflow filename is exactly `publish.yml`
2. Check file exists in `.github/workflows/` directory
3. Ensure repository and organization names are correct

### **Error: Package Not Found**

**Problem:** First-time setup fails

**Solution:**
1. Publish the package manually first using `npm publish`
2. Then configure Trusted Publisher
3. Future publishes will use OIDC

---

## 📚 **Additional Resources**

- [npm Trusted Publishers Documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Provenance Guide](https://github.blog/2023-04-19-introducing-npm-package-provenance/)

---

## 📞 **Support**

If you encounter issues:

1. 💬 [GitHub Discussions](https://github.com/tariqsaidofficial/WaQtor/discussions)
2. 🐛 [Report a Bug](https://github.com/tariqsaidofficial/WaQtor/issues/new?template=bug_report.yml)
3. 📧 [Email Support](mailto:support@dxbmark.com)
4. ☕ [Buy Me a Coffee](https://buymeacoffee.com/tariqsaidofficial)

---

**Last Updated:** October 28, 2025
**WaQtor Version:** 1.0.0
