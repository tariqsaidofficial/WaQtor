# 🔧 WaQtor Scripts

Utility scripts for WaQtor project.

## Available Scripts

### 🏥 health-check.sh

Health check script for monitoring WaQtor service status.

**Usage:**

```bash
bash scripts/health-check.sh
```

**Features:**

- Checks if service is running
- Verifies API endpoints
- Returns status code
- Useful for Docker health checks

## Adding New Scripts

When adding new scripts:

1. Place them in this `scripts/` directory
2. Add execute permissions: `chmod +x scripts/your-script.sh`
3. Document them in this README
4. Follow naming convention: `kebab-case.sh`

## Common Scripts

You can also use npm scripts defined in `package.json`:

```bash
# Start shell interface
npm run shell

# Run tests
npm test

# Generate documentation
npm run docs
```

---

**WaQtor v2.0** - WhatsApp API Client
