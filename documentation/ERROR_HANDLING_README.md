# Error Handling System - Quick Reference

## 🚀 Quick Start

### Backend

```javascript
// Import
const { asyncHandler, AppError, ErrorCodes } = require('./middleware/errorHandler');

// Create custom error
throw new AppError('Not found', 404, ErrorCodes.NOT_FOUND);

// Use async handler
router.get('/path', asyncHandler(async (req, res) => {
    // Your code - errors auto-handled
}));

// Log errors
const errorLogger = require('./utils/errorLogger');
await errorLogger.logError(error, { context });
```

### Frontend

```javascript
// Import hook
import useErrorHandler from '../hooks/useErrorHandler';

// In component
const { handleError, retryWithErrorHandling } = useErrorHandler();

// Handle error
try {
    await api.call();
} catch (error) {
    handleError(error);
}

// Retry with auto error handling
await retryWithErrorHandling(() => api.call(), { maxRetries: 3 });
```

## 📁 File Structure

### Backend
```
runtime/server/
├── middleware/
│   ├── errorHandler.js       # Main error handler
│   └── validator.js           # Request validation
├── services/
│   ├── errorMonitor.js        # Error monitoring
│   └── errorRecovery.js       # Auto recovery
├── utils/
│   └── errorLogger.js         # Error logging
└── routes/
    └── errors.js              # Error management API
```

### Frontend
```
dashboard/src/
├── components/
│   ├── ErrorBoundary.jsx      # React error boundary
│   ├── ErrorFallback.jsx      # Error UI component
│   ├── ToastProvider.jsx      # Global toast
│   └── GlobalErrorHandler.jsx # Global error handler
├── hooks/
│   └── useErrorHandler.js     # Error handling hook
├── utils/
│   └── errorHandler.js        # Error utilities
└── pages/
    └── ErrorManagement.jsx    # Error dashboard
```

## 🔑 Key Features

### 1. Error Handler (Backend)
- ✅ Custom error classes
- ✅ Error code standardization  
- ✅ Automatic error formatting
- ✅ Development vs production modes
- ✅ Stack trace handling

### 2. Error Logger
- ✅ Persistent error storage
- ✅ Error statistics and analytics
- ✅ Context preservation
- ✅ Integration ready (Sentry, LogRocket)

### 3. Error Monitor
- ✅ Real-time error tracking
- ✅ Rate-based alerting
- ✅ Critical/Warning thresholds
- ✅ EventEmitter-based alerts

### 4. Error Recovery
- ✅ Automatic retry with backoff
- ✅ Recoverable error detection
- ✅ Strategy registration system
- ✅ Built-in strategies (WhatsApp, network, rate limit)

### 5. Error Boundary (Frontend)
- ✅ React error catching
- ✅ Graceful degradation
- ✅ User-friendly error display
- ✅ Error logging integration

### 6. Error Management Dashboard
- ✅ Real-time error stats
- ✅ Visual charts and graphs
- ✅ Error history table
- ✅ Detailed error inspection
- ✅ History management

## 📊 API Endpoints

```bash
# Get error statistics
GET /api/errors/stats?timeRange=day

# Get recent errors  
GET /api/errors/recent?limit=10

# Clear error history
DELETE /api/errors/clear

# Log frontend error
POST /api/errors/log
```

## 🎯 Common Use Cases

### 1. Handle API Errors
```javascript
// Backend
router.post('/send', asyncHandler(async (req, res) => {
    const result = await sendMessage(req.body);
    res.json({ success: true, data: result });
}));

// Frontend
try {
    await api.sendMessage(data);
} catch (error) {
    handleError(error);
}
```

### 2. Validation Errors
```javascript
// Backend
const { validationError } = require('./middleware/errorHandler');

if (!phone) {
    throw validationError('Phone required', { field: 'phone' });
}
```

### 3. WhatsApp Errors
```javascript
// Backend
const { whatsappError, ErrorCodes } = require('./middleware/errorHandler');

if (!client.ready) {
    throw whatsappError('Not connected', ErrorCodes.WHATSAPP_NOT_READY);
}
```

### 4. Retry Failed Requests
```javascript
// Frontend
const { retryWithErrorHandling } = useErrorHandler();

await retryWithErrorHandling(
    () => api.sendMessage(data),
    { 
        maxRetries: 3, 
        delay: 1000,
        onRetry: (attempt) => console.log(`Retry ${attempt}`)
    }
);
```

### 5. Error Monitoring
```javascript
// Backend
const errorMonitor = require('./services/errorMonitor');

errorMonitor.on('critical', (alert) => {
    // Send alert via Slack/Email
    console.error('CRITICAL:', alert);
});
```

## 🔧 Configuration

### Environment Variables
```env
# Enable error monitoring
ERROR_MONITORING_ENABLED=true

# Alert thresholds (errors per minute)
ERROR_THRESHOLD_CRITICAL=10
ERROR_THRESHOLD_WARNING=5

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn

# Log level
LOG_LEVEL=error
```

### Custom Thresholds
```javascript
errorMonitor.setThresholds({
    critical: 15,
    warning: 8,
    info: 3
});
```

## 📝 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid data |
| `AUTHENTICATION_ERROR` | 401 | Auth failed |
| `NOT_FOUND` | 404 | Resource not found |
| `WHATSAPP_NOT_READY` | 503 | WhatsApp not ready |
| `MESSAGE_SEND_FAILED` | 500 | Send failed |
| `INTERNAL_ERROR` | 500 | Internal error |

[See full list in documentation](./ERROR_HANDLING_COMPLETE_GUIDE.md#error-codes-reference)

## 🧪 Testing

```bash
# Backend tests
cd runtime
npm test -- tests/error-handler.test.js

# Frontend tests  
cd dashboard
npm test -- src/__tests__/errorHandler.test.js
```

## 📚 Documentation

- **Complete Guide**: [ERROR_HANDLING_COMPLETE_GUIDE.md](./ERROR_HANDLING_COMPLETE_GUIDE.md)
- **Error Codes Reference**: See complete guide
- **Integration Guide**: See complete guide
- **Best Practices**: See complete guide

## 🎨 UI Components

### Error Boundary
```jsx
<ErrorBoundary>
    <YourComponent />
</ErrorBoundary>
```

### Toast Notifications
```javascript
const { showError, showSuccess } = useToast();

showSuccess('Message sent!');
showError(error);
```

### Error Management Page
Access at `/error-management` in dashboard

## 🔍 Debugging

### View Logs
- Backend: `/runtime/logs/errors.json`
- Frontend: Browser console + localStorage (`waqtor_errors`)

### Monitor Errors
- Dashboard: `/error-management`
- API: `GET /api/errors/stats`

### Clear History
```bash
curl -X DELETE http://localhost:8080/api/errors/clear \
  -H "X-API-Key: your-api-key"
```

## ✅ Integration Checklist

### Backend
- [x] Import error handlers in `index.js`
- [x] Add error routes
- [x] Setup global error handlers
- [x] Start error monitoring
- [x] Configure alert thresholds

### Frontend  
- [x] Wrap app with GlobalErrorHandler
- [x] Add ToastProvider
- [x] Use ErrorBoundary on pages
- [x] Import useErrorHandler in components
- [x] Add ErrorManagement page to routes

## 🚀 Production Checklist

- [ ] Configure Sentry/LogRocket
- [ ] Setup Email/Slack alerts
- [ ] Test all error scenarios
- [ ] Review error thresholds
- [ ] Setup log rotation
- [ ] Monitor error rates
- [ ] Document custom error codes

## 📞 Support

For help:
1. Check [Complete Guide](./ERROR_HANDLING_COMPLETE_GUIDE.md)
2. Review error logs
3. Check Error Dashboard
4. Inspect browser console (dev mode)

---

**Last Updated**: 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
