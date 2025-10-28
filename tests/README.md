# 🧪 WaQtor Tests

Test suite for WaQtor v2.0 - WhatsApp API Client

## 📁 Test Files

### Core Tests

- **client.js** - Main client functionality tests
- **quick-test.js** - Quick validation tests
- **test-waqtor.js** - WaQtor-specific features
- **helper.js** - Test helper utilities

### Message & Media Tests

- **send-message.js** - Basic message sending
- **test-send-message.js** - Message sending validation
- **test-send-image.js** - Image sending (fixed in v2.0)
- **test-send-file.js** - File upload tests
- **test-real-image.js** - Real image testing
- **test-multiple-files.js** - Multiple file handling

### WebSocket Tests

- **test-websocket.js** - WebSocket functionality
- **test-websocket-simple.js** - Simple WebSocket test
- **test-websocket-commands.js** - WebSocket command tests
- **websocket-test-client.js** - WebSocket client
- **quick-ws-test.js** - Quick WebSocket validation

### Template & Campaign Tests

- **template-examples.js** - Ready-to-use templates
- **test-send-template.js** - Template sending test
- **final-test.js** - Final integration test

### Structure Tests

- **structures/** - Data structure tests

## 🚀 Running Tests

### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Required
   export WWEBJS_TEST_REMOTE_ID="123456789@c.us"  # Your test phone number
   
   # Choose one authentication method:
   export WWEBJS_TEST_CLIENT_ID="test-session"    # For LocalAuth
   # OR
   export WWEBJS_TEST_SESSION='{"WABrowserId":"...","WASecretBundle":"...","WAToken1":"...","WAToken2":"..."}'
   # OR
   export WWEBJS_TEST_SESSION_PATH="/path/to/session.json"
   
   # Optional
   export WWEBJS_TEST_MD=1  # If using multidevice
   ```

### Run All Tests

```bash
npm test
```

### Run Specific Tests

```bash
# Quick validation
node tests/quick-test.js

# Image sending
node tests/test-send-image.js

# WebSocket
node tests/test-websocket.js

# Templates
node tests/template-examples.js
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WWEBJS_TEST_REMOTE_ID` | Valid WhatsApp ID (e.g., `123456789@c.us`) | ✅ Yes |
| `WWEBJS_TEST_CLIENT_ID` | Client ID for LocalAuth | One of these |
| `WWEBJS_TEST_SESSION` | JSON session details | One of these |
| `WWEBJS_TEST_SESSION_PATH` | Path to session JSON | One of these |
| `WWEBJS_TEST_MD` | Set to `1` for multidevice | No |

## 🎯 Test Coverage

### v2.0 Test Coverage

- ✅ Client initialization
- ✅ Authentication (LocalAuth, RemoteAuth)
- ✅ Message sending
- ✅ Media handling (images, videos, audio, documents)
- ✅ Image fix (media with preview)
- ✅ File size limits
- ✅ File organization (date-based)
- ✅ Auto cleanup system
- ✅ WebSocket functionality
- ✅ Template system
- ✅ Campaign management

## 📊 Test Results

For detailed test results, see:
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Complete testing guide
- [../documentation/guides/TESTING_GUIDE.md](../documentation/guides/TESTING_GUIDE.md) - User testing guide

## 🐛 Troubleshooting

### Common Issues

**QR Code not appearing:**
```bash
# Make sure headless is set to false
# Check puppeteer configuration
```

**Session expired:**
```bash
# Delete session and re-authenticate
rm -rf .wwebjs_auth
```

**Image sending as document:**
```bash
# This was fixed in v2.0!
# Make sure you're using the latest version
```

### Getting Help

- 📖 [Documentation](../documentation/README.md)
- 🐛 [Report Issues](https://github.com/sunmarke/waqtor/issues)
- 💬 [Discussions](https://github.com/sunmarke/waqtor/discussions)

---

**WaQtor v2.0** - Built with ❤️ for WhatsApp automation

For more information, visit: [documentation/guides/TESTING_GUIDE.md](../documentation/guides/TESTING_GUIDE.md)
