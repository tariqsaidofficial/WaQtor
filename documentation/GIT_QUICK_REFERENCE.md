# ⚡ مرجع Git السريع - WaQtor

## 🎯 الأوامر الأكثر استخداماً

### **العمل اليومي**

```bash
# 1. ابدأ العمل
git checkout waqtor-dev
git pull origin waqtor-dev

# 2. اشتغل على الكود...

# 3. احفظ التعديلات
git add .
git commit -m "✨ وصف التعديل"
git push origin waqtor-dev
```

---

### **سحب تحديثات من المشروع الأصلي**

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

git checkout waqtor-dev
git merge main
git push origin waqtor-dev
```

---

### **إنشاء ميزة جديدة**

```bash
git checkout waqtor-dev
git checkout -b feature/اسم-الميزة

# ... تعديلات ...

git add .
git commit -m "✨ إضافة ميزة جديدة"
git checkout waqtor-dev
git merge feature/اسم-الميزة
git push origin waqtor-dev
```

---

## 📋 الأوامر الأساسية

| الأمر | الوظيفة |
|-------|---------|
| `git status` | عرض حالة المشروع |
| `git log --oneline` | عرض سجل الـ commits |
| `git diff` | عرض الفروقات |
| `git branch` | عرض الـ branches |
| `git checkout waqtor-dev` | التبديل إلى waqtor-dev |
| `git pull origin waqtor-dev` | سحب التحديثات |
| `git push origin waqtor-dev` | رفع التعديلات |

---

## 🎨 رموز Commit Messages

| Emoji | الكود | الاستخدام |
|-------|------|-----------|
| ✨ | `:sparkles:` | ميزة جديدة |
| 🐛 | `:bug:` | إصلاح bug |
| 📝 | `:memo:` | توثيق |
| ⚡️ | `:zap:` | تحسين أداء |
| 🔒 | `:lock:` | أمان |
| 🔧 | `:wrench:` | إعدادات |

---

## ⚠️ قواعد مهمة

✅ **اشتغل دائماً على `waqtor-dev`**  
✅ **اعمل `git pull` قبل البدء**  
✅ **commits صغيرة ومتكررة**  
❌ **متشتغلش على `main` مباشرة**  
❌ **متستخدمش `git push -f` إلا للضرورة**

---

## 🔗 روابط مهمة

- **التوثيق الكامل:** `documentation/GIT_WORKFLOW.md`
- **Origin:** <https://github.com/tariqsaidofficial/WaQtor>
- **Upstream:** <https://github.com/pedroslopez/whatsapp-web.js>
- **npm:** <https://www.npmjs.com/package/waqtor>

---

## 📞 الدعم

- **الدعم الفني:** support@dxbmark.com
- **الاستفسارات:** info@dxbmark.com
