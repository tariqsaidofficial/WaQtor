# 🔄 دليل إدارة Git لمشروع WaQtor

## 📌 نظرة عامة

مشروع **WaQtor** هو Fork من المشروع الأصلي [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) مع تطويرات وتحسينات مستقلة.

---

## 🏗️ هيكل المشروع

```
┌─────────────────────────────────────────────┐
│  Upstream (المشروع الأصلي)                  │
│  github.com/pedroslopez/whatsapp-web.js     │
│  - نحصل منه على: Bug fixes, Security       │
│    patches, Core updates                   │
└─────────────────┬───────────────────────────┘
                  │
                  │ git fetch upstream
                  │ git merge upstream/main
                  ▼
┌─────────────────────────────────────────────┐
│  Origin (Fork الخاص بنا)                    │
│  github.com/tariqsaidofficial/WaQtor        │
│  - نخزن عليه: كل تطويراتنا                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ git push origin
                  │ git pull origin
                  ▼
         ┌────────────────────┐
         │  Local Repository  │
         │  (جهازك المحلي)    │
         └────────────────────┘
```

---

## 🌿 استراتيجية الـ Branches

### **الـ Branches الرئيسية:**

| Branch | الغرض | الاستخدام |
|--------|-------|-----------|
| **waqtor-dev** ⭐ | التطوير الرئيسي | **Default Branch** - كل العمل اليومي |
| **main** | مزامنة مع upstream | فقط للـ sync مع المشروع الأصلي |

### **الـ Branches الفرعية (حسب الحاجة):**

| Pattern | مثال | الغرض |
|---------|------|-------|
| `feature/*` | `feature/bulk-messaging` | ميزات جديدة |
| `fix/*` | `fix/session-crash` | إصلاح مشاكل |
| `hotfix/*` | `hotfix/security-patch` | إصلاحات عاجلة |
| `docs/*` | `docs/api-reference` | تحديثات التوثيق |
| `test/*` | `test/integration-tests` | اختبارات جديدة |

---

## 🔧 إعدادات Git الحالية

### **الـ Remotes:**

```bash
# عرض الـ remotes
git remote -v

# النتيجة:
origin    https://github.com/tariqsaidofficial/WaQtor.git (fetch)
origin    https://github.com/tariqsaidofficial/WaQtor.git (push)
upstream  https://github.com/pedroslopez/whatsapp-web.js.git (fetch)
upstream  https://github.com/pedroslopez/whatsapp-web.js.git (push)
```

### **الـ Branches:**

```bash
# عرض كل الـ branches
git branch -a

# النتيجة:
  main
* waqtor-dev          ← Default Branch (الفرع النشط)
  remotes/origin/main
  remotes/origin/waqtor-dev
```

---

## 📝 سيناريوهات العمل اليومية

### 1️⃣ **التطوير اليومي (الحالة الأكثر شيوعاً)**

```bash
# تأكد أنك على waqtor-dev
git checkout waqtor-dev

# اسحب آخر التحديثات من origin
git pull origin waqtor-dev

# اشتغل على الكود...
# ... تعديلات ...

# أضف التعديلات للـ staging
git add .

# أو أضف ملفات محددة
git add path/to/file.js

# عمل commit مع رسالة واضحة
git commit -m "✨ إضافة ميزة إرسال رسائل جماعية"

# رفع التعديلات على GitHub
git push origin waqtor-dev
```

### 2️⃣ **سحب تحديثات من المشروع الأصلي**

يُنصح بعمل ذلك **مرة كل أسبوع/شهر** للحصول على آخر التحديثات والإصلاحات:

```bash
# 1. الانتقال إلى main
git checkout main

# 2. سحب التحديثات من upstream
git fetch upstream

# 3. دمج التحديثات في main
git merge upstream/main

# 4. رفع main المحدث على Fork الخاص بك
git push origin main

# 5. العودة إلى waqtor-dev
git checkout waqtor-dev

# 6. دمج التحديثات من main في waqtor-dev
git merge main

# 7. إذا ظهرت conflicts، حلها ثم:
git add .
git commit -m "🔀 دمج تحديثات من upstream"

# 8. رفع waqtor-dev المحدث
git push origin waqtor-dev
```

### 3️⃣ **إنشاء ميزة جديدة (Feature Branch)**

```bash
# 1. تأكد أنك على waqtor-dev وهو محدث
git checkout waqtor-dev
git pull origin waqtor-dev

# 2. أنشئ branch جديد للميزة
git checkout -b feature/campaign-scheduler

# 3. اشتغل على الميزة...
# ... تعديلات ...

# 4. عمل commits
git add .
git commit -m "✨ إضافة جدولة الحملات"

# 5. لما تخلص، ارجع لـ waqtor-dev
git checkout waqtor-dev

# 6. ادمج الميزة الجديدة
git merge feature/campaign-scheduler

# 7. امسح الـ feature branch (اختياري)
git branch -d feature/campaign-scheduler

# 8. ارفع التحديثات
git push origin waqtor-dev
```

### 4️⃣ **إصلاح مشكلة عاجلة (Hotfix)**

```bash
# 1. من waqtor-dev، أنشئ hotfix branch
git checkout waqtor-dev
git checkout -b hotfix/fix-session-error

# 2. اعمل الإصلاح
# ... fixes ...

# 3. commit
git add .
git commit -m "🐛 إصلاح مشكلة Session timeout"

# 4. ادمج في waqtor-dev
git checkout waqtor-dev
git merge hotfix/fix-session-error

# 5. ارفع فوراً
git push origin waqtor-dev

# 6. امسح الـ hotfix branch
git branch -d hotfix/fix-session-error
```

### 5️⃣ **التراجع عن commit**

```bash
# التراجع عن آخر commit (بدون حذف التعديلات)
git reset --soft HEAD~1

# التراجع عن آخر commit (مع حذف التعديلات)
git reset --hard HEAD~1

# التراجع عن commit معين
git revert <commit-hash>
```

### 6️⃣ **حل Conflicts**

عند ظهور conflicts أثناء merge:

```bash
# 1. افتح الملفات المتعارضة واحل الـ conflicts يدوياً

# 2. بعد الحل، أضف الملفات
git add <conflicted-files>

# 3. أكمل الـ merge
git commit -m "🔀 حل conflicts مع upstream"

# 4. ارفع التحديثات
git push origin waqtor-dev
```

---

## 📊 أوامر Git مفيدة

### **معلومات عن الحالة:**

```bash
# حالة الـ repository
git status

# سجل الـ commits
git log --oneline --graph --all

# الفروقات بين الملفات
git diff

# الفروقات بين branches
git diff waqtor-dev..main
```

### **إدارة الـ Branches:**

```bash
# عرض كل الـ branches
git branch -a

# إنشاء branch جديد
git checkout -b new-branch-name

# حذف branch محلي
git branch -d branch-name

# حذف branch من GitHub
git push origin --delete branch-name

# إعادة تسمية branch
git branch -m old-name new-name
```

### **التزامن مع GitHub:**

```bash
# سحب آخر التحديثات
git pull origin waqtor-dev

# رفع التعديلات
git push origin waqtor-dev

# رفع branch جديد لأول مرة
git push -u origin new-branch-name

# رفع إجباري (استخدم بحذر!)
git push -f origin waqtor-dev
```

---

## ⚠️ قواعد مهمة

### ✅ **افعل:**

- ✅ اشتغل دائماً على `waqtor-dev` أو feature branches
- ✅ اعمل `git pull` قبل بدء العمل
- ✅ اكتب commit messages واضحة وصفية
- ✅ اعمل commits صغيرة ومتكررة
- ✅ سحب تحديثات من upstream بانتظام
- ✅ استخدم feature branches للميزات الكبيرة

### ❌ **لا تفعل:**

- ❌ متشتغلش مباشرة على `main`
- ❌ متستخدمش `git push -f` إلا في حالات نادرة جداً
- ❌ متعملش commit لملفات حساسة (credentials, .env)
- ❌ متعملش commits كبيرة جداً (صعب review)
- ❌ متنساش تعمل pull قبل push

---

## 🎨 دليل رسائل Commit

استخدم emojis لتوضيح نوع التعديل:

| Emoji | الكود | الاستخدام |
|-------|------|-----------|
| ✨ | `:sparkles:` | ميزة جديدة |
| 🐛 | `:bug:` | إصلاح bug |
| 📝 | `:memo:` | تحديث توثيق |
| 🎨 | `:art:` | تحسين الكود |
| ⚡️ | `:zap:` | تحسين الأداء |
| 🔒 | `:lock:` | إصلاحات أمنية |
| 🔧 | `:wrench:` | تعديل إعدادات |
| 🚀 | `:rocket:` | نشر إصدار جديد |
| ♻️ | `:recycle:` | Refactoring |
| 🔀 | `:twisted_rightwards_arrows:` | دمج branches |

**أمثلة:**

```bash
git commit -m "✨ إضافة ميزة إرسال الوسائط المتعددة"
git commit -m "🐛 إصلاح مشكلة انقطاع الاتصال"
git commit -m "📝 تحديث README مع أمثلة الاستخدام"
git commit -m "⚡️ تحسين سرعة معالجة الرسائل"
git commit -m "🔒 تحديث مكتبات الأمان"
```

---

## 📦 نشر إصدار جديد على npm

عند الاستعداد لنشر إصدار جديد:

```bash
# 1. تأكد من أن waqtor-dev محدث ومستقر
git checkout waqtor-dev
git pull origin waqtor-dev

# 2. قم بتحديث رقم الإصدار في package.json
# (يمكن استخدام npm version)
npm version patch  # for 1.34.1 -> 1.34.2
# or
npm version minor  # for 1.34.1 -> 1.35.0
# or
npm version major  # for 1.34.1 -> 2.0.0

# 3. ارفع التحديثات مع الـ tag
git push origin waqtor-dev --tags

# 4. انشر على npm
npm publish

# 5. اعمل Release على GitHub (اختياري)
# من GitHub UI → Releases → Draft a new release
```

---

## 🔐 ملفات يجب تجاهلها

تأكد من وجود `.gitignore` يحتوي على:

```gitignore
# الاعتمادات
node_modules/
package-lock.json

# ملفات البيئة
.env
.env.local
.env.*.local

# Session files
.wwebjs_auth/
.wwebjs_cache/
runtime/server/session/
*.session

# Logs
logs/
*.log
npm-debug.log*

# Database
*.db
*.sqlite

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## 📞 معلومات الدعم

### **الريبو:**
- **Origin (Fork):** https://github.com/tariqsaidofficial/WaQtor
- **Upstream (Original):** https://github.com/pedroslopez/whatsapp-web.js

### **npm Package:**
- **الاسم:** `waqtor`
- **الرابط:** https://www.npmjs.com/package/waqtor

### **الاتصال:**
- **الدعم الفني:** support@dxbmark.com
- **الاستفسارات:** info@dxbmark.com
- **المطور:** Tariq Said (tariqsaidofficial)

---

## 🆘 حل المشاكل الشائعة

### **مشكلة: `git push rejected`**

```bash
# الحل: اسحب التحديثات أولاً
git pull origin waqtor-dev
# ثم ارفع
git push origin waqtor-dev
```

### **مشكلة: `Merge conflict`**

```bash
# 1. افتح الملفات المتعارضة
# 2. ابحث عن:
#    <<<<<<< HEAD
#    your changes
#    =======
#    their changes
#    >>>>>>> branch-name
# 3. احذف العلامات واختر التعديلات المناسبة
# 4. أضف الملفات
git add <conflicted-files>
git commit -m "🔀 حل conflicts"
```

### **مشكلة: `detached HEAD state`**

```bash
# العودة إلى waqtor-dev
git checkout waqtor-dev
```

### **مشكلة: تعديلات غير محفوظة**

```bash
# حفظ التعديلات مؤقتاً
git stash

# استرجاعها لاحقاً
git stash pop

# أو تجاهلها
git stash drop
```

---

## 📚 مصادر إضافية

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [npm Documentation](https://docs.npmjs.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**آخر تحديث:** أكتوبر 28, 2025  
**الإصدار الحالي:** 1.34.1  
**Default Branch:** `waqtor-dev`
