# 🚀 Docker Quick Start Guide

## متطلبات التشغيل (Requirements)

قبل البدء، تأكد من تثبيت:
- ✅ Docker Desktop
- ✅ Docker Compose
- ✅ Git (اختياري)

## 🏁 البدء السريع (Quick Start)

### 1. انتقل إلى مجلد Docker
```bash
cd /Users/sunmarke/Downloads/Waqtor-main
cd docker
```

### 2. شغّل البيئة التطويرية
```bash
./start-dev.sh
```

أو في وضع الخلفية (Background):
```bash
./start-dev.sh -d
```

### 3. وصول الخدمات

بعد التشغيل الناجح:
- 🌐 **Dashboard**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:8080
- 💚 **Health Check**: http://localhost:8080/health

---

## 🎯 الأوامر الأساسية

### تشغيل (Start)
```bash
cd docker
./start-dev.sh           # تشغيل في Foreground
./start-dev.sh -d        # تشغيل في Background
./start-dev.sh --pull    # سحب آخر التحديثات أولاً
```

### إيقاف (Stop)
```bash
cd docker
./stop-dev.sh
```

### عرض السجلات (Logs)
```bash
cd docker
./logs.sh                # جميع السجلات
./logs.sh backend        # سجلات Backend فقط
./logs.sh dashboard      # سجلات Dashboard فقط
```

### إعادة البناء (Rebuild)
```bash
cd docker
./rebuild.sh
```

---

## ⚙️ الإعداد الأولي (Initial Setup)

### 1. إعداد ملف البيئة (.env)

عند أول تشغيل، سيتم إنشاء ملف `.env` تلقائياً من القالب `.env.docker`.

**هام جداً**: افتح الملف وعدّل `API_KEY`:

```bash
# في المجلد الرئيسي
nano .env

# أو
code .env
```

غيّر هذا السطر:
```
API_KEY=your-secure-api-key-here
```

إلى مفتاح آمن مثل:
```
API_KEY=my-super-secret-key-2024
```

**ملاحظة**: يجب أن يتطابق `API_KEY` مع `NEXT_PUBLIC_API_KEY` في نفس الملف.

### 2. التحقق من الموانئ (Ports)

تأكد من أن الموانئ التالية غير مستخدمة:
- ✅ Port **8080** (Backend)
- ✅ Port **3000** (Dashboard)

للتحقق:
```bash
lsof -i :8080
lsof -i :3000
```

إذا كانت مستخدمة، أوقف الخدمات أو غيّر الموانئ في `docker-compose.dev.yml`.

---

## 📁 هيكل المشروع (Project Structure)

```
Waqtor-main/
├── .env                     # ملف البيئة (يُنشأ تلقائياً)
├── .env.docker              # قالب ملف البيئة
├── docker/
│   ├── Dockerfile.backend   # Backend Docker Image
│   ├── Dockerfile.dashboard # Dashboard Docker Image
│   ├── docker-compose.dev.yml
│   ├── start-dev.sh         # ✅ تشغيل
│   ├── stop-dev.sh          # ⛔ إيقاف
│   ├── logs.sh              # 📋 السجلات
│   └── rebuild.sh           # 🔨 إعادة البناء
├── src/                     # Backend Source
├── runtime/                 # Backend Runtime
└── dashboard/               # Frontend Source
```

---

## 🔥 Hot Reload

تم تفعيل Hot Reload لكل من Backend و Dashboard:

### Backend
- أي تعديل في `src/`, `runtime/`, `index.js`, `shell.js` سيُطبّق فوراً
- يستخدم `nodemon` للمراقبة

### Dashboard
- أي تعديل في `dashboard/` سيُطبّق فوراً
- Next.js Fast Refresh مُفعّل

---

## 🐛 استكشاف الأخطاء (Troubleshooting)

### ❌ خطأ: "Port already in use"

**الحل**:
```bash
# ابحث عن العملية المستخدمة للميناء
lsof -i :8080
lsof -i :3000

# أوقف العملية
kill -9 <PID>

# أو غيّر الميناء في docker-compose.dev.yml
```

### ❌ خطأ: "Docker is not running"

**الحل**:
1. افتح Docker Desktop
2. انتظر حتى يصبح جاهزاً
3. أعد تشغيل `./start-dev.sh`

### ❌ خطأ: "EACCES: permission denied"

**الحل**:
```bash
# امنح صلاحيات التنفيذ
chmod +x docker/*.sh
```

### ❌ Dashboard لا يتصل بـ Backend

**التحقق**:
1. تأكد من أن Backend يعمل:
   ```bash
   curl http://localhost:8080/health
   ```

2. تحقق من السجلات:
   ```bash
   ./logs.sh backend
   ./logs.sh dashboard
   ```

3. تأكد من أن `API_KEY` متطابق في `.env`:
   ```
   API_KEY=same-key-here
   NEXT_PUBLIC_API_KEY=same-key-here
   ```

### ❌ "Module not found" errors

**الحل**:
```bash
# أعد بناء الـ containers
cd docker
./rebuild.sh
```

### ❌ WhatsApp QR Code لا يظهر

**التحقق**:
1. تحقق من سجلات Backend:
   ```bash
   ./logs.sh backend
   ```

2. تأكد من أن Chromium يعمل في Container:
   ```bash
   docker exec -it waqtor-backend-dev sh
   chromium-browser --version
   ```

3. تحقق من Permissions:
   ```bash
   docker exec -it waqtor-backend-dev ls -la /app/.wwebjs_auth
   ```

---

## 🔄 أوامر Docker المباشرة

إذا احتجت لأوامر Docker مباشرة:

### عرض الـ Containers
```bash
docker ps
```

### الدخول إلى Backend Container
```bash
docker exec -it waqtor-backend-dev sh
```

### الدخول إلى Dashboard Container
```bash
docker exec -it waqtor-dashboard-dev sh
```

### عرض السجلات
```bash
docker-compose -f docker/docker-compose.dev.yml logs -f
```

### إيقاف وحذف كل شيء
```bash
docker-compose -f docker/docker-compose.dev.yml down -v
```

### إعادة البناء من الصفر
```bash
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.dev.yml build --no-cache
docker-compose -f docker/docker-compose.dev.yml up
```

---

## 📊 Health Checks

كل service لديه health check:

### Backend
```bash
curl http://localhost:8080/health
```

**الاستجابة المتوقعة**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### Dashboard
```bash
curl http://localhost:3000
```

---

## 🌐 Network Configuration

الـ Backend و Dashboard متصلين عبر شبكة Docker خاصة (`waqtor-network`).

### اتصال Browser → Backend
- استخدام: `http://localhost:8080`
- المتغير: `NEXT_PUBLIC_BROWSER_API_URL`

### اتصال Dashboard SSR → Backend
- استخدام: `http://backend:8080`
- المتغير: `NEXT_PUBLIC_API_URL`

هذا يسمح بـ:
- ✅ Server-side rendering في Dashboard
- ✅ Client-side requests من المتصفح
- ✅ WebSocket connections

---

## 📦 Volumes (البيانات المحفوظة)

البيانات التالية محفوظة في Docker Volumes:

- `waqtor-sessions`: جلسات WhatsApp
- `waqtor-cache`: ذاكرة التخزين المؤقت
- `waqtor-logs`: سجلات التطبيق
- `waqtor-uploads`: الملفات المرفوعة

### عرض الـ Volumes
```bash
docker volume ls | grep waqtor
```

### حذف الـ Volumes (⚠️ سيحذف كل البيانات!)
```bash
docker-compose -f docker/docker-compose.dev.yml down -v
```

---

## 🚀 Production Deployment

للإنتاج (Production)، استخدم:
```bash
docker-compose -f docker/docker-compose.yml up -d
```

**الفرق**:
- ✅ Optimized builds
- ✅ No hot reload
- ✅ Production environment
- ✅ Better security

---

## 📚 الدعم والتوثيق

للمزيد من التفاصيل:

- 📖 [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md) - دليل شامل
- 📖 [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) - استكشاف الأخطاء
- 📖 [README.md](./README.md) - وثائق المشروع الرئيسية

---

## ✅ Checklist للتحقق من الإعداد

قبل البدء، تأكد من:

- [ ] Docker Desktop مُثبّت ويعمل
- [ ] تم تعديل `API_KEY` في `.env`
- [ ] الموانئ 8080 و 3000 متاحة
- [ ] صلاحيات التنفيذ للـ shell scripts (`chmod +x docker/*.sh`)
- [ ] مساحة كافية على القرص (على الأقل 2GB)

---

## 🎉 نجاح التشغيل!

إذا رأيت هذه الرسالة:
```
🎉 Waqtor Development Environment is ready!

Access services:
  Backend API:    http://localhost:8080
  Dashboard:      http://localhost:3000
  Health Check:   http://localhost:8080/health
```

**تهانينا! 🎊** البيئة التطويرية جاهزة للاستخدام.

---

**آخر تحديث**: يناير 2024  
**الإصدار**: 1.0.0  
**المؤلف**: Waqtor Team
