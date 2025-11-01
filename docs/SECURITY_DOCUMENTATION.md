# 🔐 Security Documentation - Waqtor System

## 📋 Overview

توثيق شامل لجميع آليات الأمان في نظام Waqtor.

---

## 🔑 API Keys

### الموقع
- **Database**: SQLite (`runtime/server/db/waqtor.db`)
- **Table**: `api_keys`
- **Middleware**: `runtime/server/middlewares/auth.js`

### التخزين
```sql
CREATE TABLE api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME
);
```

### ⚠️ الأمان الحالي
- ❌ **غير مشفرة** - يتم تخزين API Keys كـ plain text
- ✅ يتم التحقق من `is_active` flag
- ✅ يتم تتبع `last_used_at`

### Default API Key
```
Key: waqtor_default_key_change_me
Name: Default API Key
```

### كيفية الاستخدام
```bash
# في الـ Headers
X-API-Key: your_api_key_here

# أو في Query Parameters
?apiKey=your_api_key_here
```

### التحقق
```javascript
// في auth.js
async function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    // 1. Check environment variable first
    if (apiKey === process.env.API_KEY) {
        return next();
    }
    
    // 2. Check database
    const validKey = await db.verifyApiKey(apiKey);
    if (!validKey) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    
    next();
}
```

### 🔒 التوصيات الأمنية

#### 1. تشفير API Keys
```javascript
// استخدام bcrypt لتشفير API Keys
const bcrypt = require('bcryptjs');

// عند إنشاء API Key
const apiKey = generateRandomKey(); // e.g., crypto.randomBytes(32).toString('hex')
const hashedKey = await bcrypt.hash(apiKey, 10);

// تخزين hashedKey في قاعدة البيانات
// إرجاع apiKey للمستخدم مرة واحدة فقط

// عند التحقق
const isValid = await bcrypt.compare(providedKey, storedHashedKey);
```

#### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each key to 100 requests per windowMs
    message: 'Too many requests from this API key'
});
```

#### 3. Key Rotation
- إضافة `expires_at` field
- إرسال تنبيهات قبل انتهاء الصلاحية
- إمكانية تجديد المفاتيح

---

## 🎫 JWT Tokens

### الموقع
- **Middleware**: `runtime/server/middlewares/jwtAuth.js`
- **Routes**: `runtime/server/routes/auth.js`

### التكوين
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
```

### ✅ الأمان الحالي
- ✅ **مشفرة** - JWT tokens موقعة بـ JWT_SECRET
- ✅ Expiration time (7 أيام افتراضياً)
- ✅ يتم التحقق من `is_active` للمستخدم
- ✅ Role-based authorization

### Token Structure
```javascript
// Payload
{
    id: user.id,        // UUID
    email: user.email,
    role: user.role,    // 'admin', 'user', 'viewer'
    iat: 1234567890,    // Issued at
    exp: 1234567890     // Expires at
}
```

### إنشاء Token
```javascript
// في routes/auth.js
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
}
```

### التحقق من Token
```javascript
// في middlewares/jwtAuth.js
async function jwtAuth(req, res, next) {
    // 1. استخراج Token من Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // 2. التحقق من Token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. جلب المستخدم من قاعدة البيانات
    const user = await User.findByPk(decoded.id);
    
    // 4. التحقق من is_active
    if (!user || !user.is_active) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    // 5. إرفاق المستخدم بالـ request
    req.user = user;
    next();
}
```

### كيفية الاستخدام
```bash
# في الـ Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🔒 الأمان الحالي - ممتاز!

#### ✅ ما تم تطبيقه
1. **Token Signing** - JWT موقع بـ secret key
2. **Expiration** - Token ينتهي بعد 7 أيام
3. **User Validation** - التحقق من وجود المستخدم وحالته
4. **Role-based Access** - دعم الأدوار (admin, user, viewer)
5. **Secure Storage** - لا يتم تخزين Token في Backend

#### 🔒 التوصيات الإضافية

1. **Refresh Tokens**
```javascript
// إضافة refresh token للحصول على token جديد بدون login
const refreshToken = generateRefreshToken(user);
// تخزين refresh token في database مع expiry أطول
```

2. **Token Blacklist**
```javascript
// عند logout، إضافة token إلى blacklist
const blacklistedTokens = new Set();

function blacklistToken(token) {
    blacklistedTokens.add(token);
}

// في jwtAuth middleware
if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
}
```

3. **HTTPS Only**
```javascript
// في production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect('https://' + req.headers.host + req.url);
        }
        next();
    });
}
```

---

## 🔐 Passwords

### الموقع
- **Model**: `runtime/server/models/User.js`

### ✅ الأمان الحالي - ممتاز!
- ✅ **مشفرة** - bcrypt hashing
- ✅ Salt rounds: 10
- ✅ Minimum length: 6 characters
- ✅ Never returned in API responses

### التشفير
```javascript
// في User.js
User.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
```

### التحقق
```javascript
User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};
```

### 🔒 التوصيات الإضافية

1. **Password Strength**
```javascript
const passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
```

2. **Password Reset**
```javascript
// إضافة reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

await user.update({
    reset_token: resetTokenHash,
    reset_token_expires: Date.now() + 3600000 // 1 hour
});

// إرسال resetToken للمستخدم عبر email
```

3. **Failed Login Attempts**
```javascript
// إضافة في User model
failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
},
locked_until: {
    type: DataTypes.DATE,
    allowNull: true
}

// Lock account after 5 failed attempts
if (user.failed_login_attempts >= 5) {
    await user.update({
        locked_until: Date.now() + 900000 // 15 minutes
    });
}
```

---

## 🔐 Access Codes (Block UI System)

### الموقع
- **Model**: `runtime/server/models/AccessCode.js`
- **Service**: `runtime/server/services/subscriptionService.js`

### ✅ الأمان الحالي - ممتاز!
- ✅ **مشفرة** - SHA-256 hashing
- ✅ 6 digits
- ✅ Max uses limit
- ✅ Expiration dates
- ✅ Access logging

### التشفير
```javascript
// في AccessCode.js
const crypto = require('crypto');

AccessCode.hashCode = (code) => {
    return crypto.createHash('sha256').update(code).digest('hex');
};
```

### التحقق
```javascript
AccessCode.verifyCode = async (code, featureName) => {
    const codeHash = AccessCode.hashCode(code);
    
    const accessCode = await AccessCode.findOne({
        where: {
            codeHash,
            featureName,
            isActive: true
        }
    });
    
    // Check expiration
    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
        return { valid: false, reason: 'Code expired' };
    }
    
    // Check usage limit
    if (accessCode.maxUses && accessCode.usedCount >= accessCode.maxUses) {
        return { valid: false, reason: 'Code usage limit reached' };
    }
    
    return { valid: true, accessCode };
};
```

### Default Code
```
Code: 330022
Hash: SHA-256(330022)
Type: Lifetime
Max Uses: Unlimited
```

---

## 📊 Security Summary

### ✅ ما تم تطبيقه بشكل صحيح

| Component | Security Level | Details |
|-----------|---------------|---------|
| **JWT Tokens** | 🟢 ممتاز | مشفرة، expiration، validation |
| **Passwords** | 🟢 ممتاز | bcrypt hashing، salt rounds |
| **Access Codes** | 🟢 ممتاز | SHA-256، expiration، limits |
| **API Keys** | 🟡 متوسط | Plain text (يحتاج تحسين) |

### ⚠️ ما يحتاج تحسين

1. **API Keys** - تشفير بـ bcrypt
2. **Rate Limiting** - إضافة حدود للطلبات
3. **HTTPS** - إجباري في production
4. **Refresh Tokens** - للـ JWT
5. **Password Strength** - validation أقوى

---

## 🛡️ Best Practices

### 1. Environment Variables
```env
# .env file
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
API_KEY=your-api-key-here
DATABASE_URL=postgresql://...
NODE_ENV=production
```

### 2. CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

### 3. Helmet.js
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // ...
});
```

### 5. SQL Injection Prevention
```javascript
// ✅ استخدام Sequelize (parameterized queries)
User.findOne({ where: { email: userEmail } });

// ❌ لا تستخدم raw queries بدون parameters
db.query(`SELECT * FROM users WHERE email = '${userEmail}'`); // DANGEROUS!
```

---

## 🔍 Security Checklist

### Production Deployment

- [ ] تغيير JWT_SECRET إلى قيمة قوية
- [ ] تغيير default API key
- [ ] تفعيل HTTPS
- [ ] إضافة rate limiting
- [ ] تشفير API keys في database
- [ ] إضافة helmet.js
- [ ] تكوين CORS بشكل صحيح
- [ ] إضافة logging للـ security events
- [ ] إعداد backup للـ database
- [ ] تفعيل monitoring و alerts

### Code Review

- [ ] لا توجد secrets في الكود
- [ ] جميع الـ passwords مشفرة
- [ ] جميع الـ inputs معقمة
- [ ] Error messages لا تكشف معلومات حساسة
- [ ] Authentication على جميع الـ protected routes
- [ ] Authorization checks موجودة

---

## 📞 Security Contacts

في حالة اكتشاف ثغرة أمنية:
1. لا تنشر الثغرة علناً
2. أرسل تقرير مفصل
3. انتظر الرد قبل الإفصاح

---

**Last Updated**: 2025-11-01  
**Version**: 1.0.0  
**Status**: ✅ Documented
