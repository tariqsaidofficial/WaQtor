# 🔧 Icons Troubleshooting Guide

## ✅ Current Status

All PrimeIcons are properly configured and should be displaying correctly. If you're experiencing issues, follow this guide.

---

## 📁 Files Configuration

### 1. **Font Files Location**
```
/dashboard/public/fonts/
├── primeicons.eot
├── primeicons.svg
├── primeicons.ttf
├── primeicons.woff
└── primeicons.woff2
```

### 2. **CSS Files**
- `/dashboard/public/primeicons.css` - Custom font-face definitions
- `/dashboard/src/components/ui/layout/_overrides.scss` - Icon visibility fixes

### 3. **Layout Configuration**
- `/dashboard/src/app/layout.tsx` - CSS import order

---

## 🔍 Troubleshooting Steps

### **Issue: Icons Not Showing**

#### Step 1: Clear Browser Cache
```bash
# Chrome/Edge: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
# Firefox: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
# Safari: Cmd+Option+E (Mac)
```

#### Step 2: Hard Refresh
```
Windows: Ctrl + F5
Mac: Cmd + Shift + R
```

#### Step 3: Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for font loading errors
4. Check Network tab for 404 errors on font files

#### Step 4: Verify Font Files
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
ls -la public/fonts/primeicons.*
```

Should show 5 files (eot, svg, ttf, woff, woff2)

#### Step 5: Check CSS Loading Order
In `layout.tsx`, ensure this order:
```tsx
import 'primeicons/primeicons.css';  // FIRST
import 'primereact/resources/primereact.css';  // SECOND
import 'primeflex/primeflex.css';  // THIRD
```

---

## 🎨 CSS Overrides Applied

### Icon Visibility Fix
```scss
.pi {
    font-family: 'primeicons' !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
}
```

### Button Icons
```scss
.p-button-icon {
    font-family: 'primeicons' !important;
    display: inline-block !important;
}
```

---

## 🧪 Test Icons

### Quick Test in Browser Console
```javascript
// Check if font is loaded
document.fonts.check('1em primeicons')

// Check if CSS is applied
getComputedStyle(document.querySelector('.pi')).fontFamily
```

### Visual Test
Look for these icons in the app:
- 😀 Emoji button in Message Composer
- **B** Bold button
- _I_ Italic button
- 📱 Phone icons in Recipients
- ✓ Checkboxes in DataTable

---

## 🔄 If Icons Still Not Showing

### Option 1: Restart Dev Server
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
npm run dev
```

### Option 2: Rebuild
```bash
rm -rf .next
npm run dev
```

### Option 3: Check Node Modules
```bash
ls -la node_modules/primeicons/fonts/
```

Should contain the same 5 font files.

### Option 4: Reinstall PrimeReact
```bash
npm uninstall primeicons primereact
npm install primeicons primereact
```

---

## 📋 Icon Classes Reference

### Common Icons Used in WaQtor

| Icon | Class | Usage |
|------|-------|-------|
| 😀 | `pi pi-face-smile` | Emoji picker |
| **B** | `pi pi-bold` | Bold formatting |
| _I_ | `pi pi-italic` | Italic formatting |
| ~~S~~ | `pi pi-minus` | Strikethrough |
| `<>` | `pi pi-code` | Inline code |
| 📝 | `pi pi-file-edit` | Monospace |
| • | `pi pi-list` | Bullet list |
| > | `pi pi-angle-right` | Quote |
| 📱 | `pi pi-phone` | Phone |
| 👤 | `pi pi-user` | User |
| ✓ | `pi pi-check` | Success |
| ✕ | `pi pi-times` | Close/Cancel |
| 📊 | `pi pi-chart-bar` | Analytics |
| ⚙️ | `pi pi-cog` | Settings |

---

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Font Format Support
- **WOFF2**: All modern browsers (preferred)
- **WOFF**: Fallback for older browsers
- **TTF**: Universal fallback
- **EOT**: IE11 support
- **SVG**: Legacy iOS support

---

## 🚀 Performance Tips

1. **Font Preloading** (Optional)
```html
<link rel="preload" href="/fonts/primeicons.woff2" as="font" type="font/woff2" crossorigin>
```

2. **CDN Alternative** (Not recommended)
```html
<link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css">
```

---

## 📞 Still Having Issues?

### Check These Files:
1. `/dashboard/public/primeicons.css`
2. `/dashboard/src/components/ui/layout/_overrides.scss`
3. `/dashboard/src/app/layout.tsx`

### Common Mistakes:
- ❌ Wrong CSS import order
- ❌ Missing font files
- ❌ Browser cache not cleared
- ❌ Incorrect font path in CSS
- ❌ CSS specificity issues

### Debug Commands:
```bash
# Check if fonts exist
ls -la public/fonts/

# Check CSS file
cat public/primeicons.css | head -20

# Check for font loading in browser
# DevTools > Network > Filter: "font"
```

---

## ✅ Verification Checklist

- [ ] Font files exist in `/public/fonts/`
- [ ] `primeicons.css` exists in `/public/`
- [ ] CSS import order is correct in `layout.tsx`
- [ ] Browser cache cleared
- [ ] Hard refresh performed (Ctrl+F5 / Cmd+Shift+R)
- [ ] Dev server restarted
- [ ] Icons visible in Message Composer
- [ ] Icons visible in Recipients table
- [ ] Icons visible in all buttons

---

**If all steps completed and icons still not showing, there may be a deeper Next.js configuration issue. Check the Next.js console output for errors.**
