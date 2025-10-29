# 🐳 دليل Docker السريع - Waqtor

## 🚀 البدء السريع

### 1. التحضير

```bash
# نسخ ملف البيئة
cp .env.docker .env

# تعديل الملف وتعيين API_KEY
nano .env
```

### 2. تشغيل التطبيق

```bash
# تشغيل في الخلفية
cd docker
./start-dev.sh -d

# أو تشغيل مباشر (مع عرض الـ logs)
./start-dev.sh
```

### 3. الوصول للخدمات

- **Backend API:** http://localhost:8080
- **Dashboard:** http://localhost:3000  
- **Health Check:** http://localhost:8080/health

---

## 📝 الأوامر الأساسية

### تشغيل

```bash
# تشغيل مع عرض logs
./docker/start-dev.sh

# تشغيل في الخلفية
./docker/start-dev.sh -d
```

### إيقاف

```bash
# إيقاف بدون حذف البيانات
./docker/stop-dev.sh

# إيقاف مع حذف جميع البيانات
./docker/stop-dev.sh -v
```

### عرض Logs

```bash
# عرض كل الـ logs
./docker/logs.sh

# عرض logs الـ backend فقط
./docker/logs.sh backend

# عرض logs الـ dashboard فقط
./docker/logs.sh dashboard
```

### إعادة البناء

```bash
# إعادة بناء الـ containers
./docker/rebuild.sh

# إعادة بناء كاملة (تنظيف أولاً)
./docker/rebuild.sh --clean
```

---

## 🔍 استكشاف الأخطاء

### المنافذ مستخدمة

```bash
# معرفة من يستخدم المنفذ
lsof -i :8080
lsof -i :3000

# إيقاف العملية
kill -9 <PID>
```

### مشاكل الاتصال

```bash
# فحص صحة Backend
curl http://localhost:8080/health

# فحص الـ network
docker network ls | grep waqtor

# فحص الـ containers
docker ps --filter "name=waqtor"
```

### مشاكل WhatsApp

```bash
# عرض logs الـ backend
./docker/logs.sh backend

# الدخول للـ container
docker exec -it waqtor-backend-dev sh

# فحص ملفات الجلسة
ls -la /app/.wwebjs_auth
```

### إعادة تشغيل نظيفة

```bash
# إيقاف كل شيء
./docker/stop-dev.sh -v

# إعادة البناء
./docker/rebuild.sh --clean

# تشغيل من جديد
./docker/start-dev.sh
```

---

## 📊 مراقبة النظام

### موارد النظام

```bash
# إحصائيات الـ containers
docker stats waqtor-backend-dev waqtor-dashboard-dev

# مساحة القرص
docker system df

# حجم الـ volumes
docker system df -v | grep waqtor
```

### Logs مباشرة

```bash
# متابعة logs مباشرة
docker-compose -f docker/docker-compose.dev.yml logs -f

# آخر 100 سطر
docker-compose -f docker/docker-compose.dev.yml logs --tail=100
```

---

## 🔧 أوامر متقدمة

### الدخول للـ Container

```bash
# Backend
docker exec -it waqtor-backend-dev sh

# Dashboard
docker exec -it waqtor-dashboard-dev sh
```

### تنفيذ أوامر npm

```bash
# في Backend
docker exec -it waqtor-backend-dev npm run test
docker exec -it waqtor-backend-dev npm install <package>

# في Dashboard
docker exec -it waqtor-dashboard-dev npm run build
docker exec -it waqtor-dashboard-dev npm install <package>
```

### إدارة الـ Volumes

```bash
# عرض الـ volumes
docker volume ls | grep waqtor

# فحص volume
docker volume inspect waqtor-sessions

# نسخ احتياطي
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar czf /backup/sessions.tar.gz -C /data .

# استعادة النسخة
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar xzf /backup/sessions.tar.gz -C /data
```

---

## ⚙️ التكوين

### ملف .env

```env
# API Configuration
API_KEY=your-secure-key-here
PORT=8080

# Dashboard
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_API_KEY=your-secure-key-here
```

### تغيير المنافذ

في `docker/docker-compose.dev.yml`:

```yaml
services:
  backend:
    ports:
      - "8080:8080"  # غيّر الرقم الأول

  dashboard:
    ports:
      - "3000:3000"  # غيّر الرقم الأول
```

---

## 🎯 سير العمل اليومي

### 1. بدء اليوم

```bash
# تشغيل الخدمات
./docker/start-dev.sh -d

# فحص الحالة
curl http://localhost:8080/health
```

### 2. التطوير

- عدّل الكود في `/runtime` أو `/dashboard`
- الـ Hot Reload يعمل تلقائياً
- لا حاجة لإعادة بناء الـ container

### 3. الاختبار

```bash
# عرض logs
./docker/logs.sh

# اختبار Backend
curl http://localhost:8080/api/status/info

# فتح Dashboard
open http://localhost:3000
```

### 4. نهاية اليوم

```bash
# إيقاف الخدمات (مع حفظ البيانات)
./docker/stop-dev.sh
```

---

## 🔐 الأمان

### توليد API Key آمن

```bash
# طريقة 1
openssl rand -hex 32

# طريقة 2
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### حماية .env

```bash
# تأكد من إضافته لـ .gitignore
echo ".env" >> .gitignore

# صلاحيات محدودة
chmod 600 .env
```

---

## 📚 المصادر

- [README الكامل](./README.md)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js with Docker](https://nextjs.org/docs/deployment#docker-image)

---

## ✅ نصائح مهمة

### ✅ افعل

- استخدم API Key قوي
- راجع logs بانتظام
- احتفظ بنسخ احتياطية من volumes
- حدّث الصور الأساسية دورياً

### ❌ لا تفعل

- لا تشارك ملف .env
- لا تحذف volumes بدون نسخ احتياطي
- لا تشغل كـ root في الإنتاج
- لا تستخدم API key ضعيف

---

## 🆘 المساعدة

### مشكلة شائعة

| المشكلة | الحل |
|---------|------|
| منفذ مستخدم | `lsof -i :8080` وأغلق العملية |
| container لا يبدأ | `./docker/rebuild.sh --clean` |
| بطء في التشغيل | تحقق من موارد Docker |
| مشاكل الصلاحيات | `chmod -R 777 .wwebjs_auth` |

### طلب المساعدة

```bash
# جمع معلومات للمساعدة
docker-compose -f docker/docker-compose.dev.yml ps
docker-compose -f docker/docker-compose.dev.yml logs --tail=50
docker system info
```

---

**آخر تحديث:** 2025  
**الإصدار:** 1.0.0  
**الحالة:** ✅ جاهز للتطوير
