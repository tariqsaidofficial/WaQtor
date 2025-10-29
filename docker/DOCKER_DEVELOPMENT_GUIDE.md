# 🐳 Docker Development Environment Guide

## Overview
This guide explains how to use Docker to run the complete Waqtor stack (Backend + Dashboard) with hot reload and seamless integration.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│  Docker Network: waqtor-network             │
│                                             │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │              │      │                 │ │
│  │   Backend    │◄────►│   Dashboard     │ │
│  │  (Node.js)   │      │  (Next.js)      │ │
│  │   :8080      │      │    :3000        │ │
│  │              │      │                 │ │
│  └──────────────┘      └─────────────────┘ │
│         │                                   │
│         ▼                                   │
│  ┌─────────────────────────────┐           │
│  │  Persistent Volumes:        │           │
│  │  - Sessions                 │           │
│  │  - Cache                    │           │
│  │  - Logs                     │           │
│  │  - Uploads                  │           │
│  └─────────────────────────────┘           │
└─────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

1. **Docker** (v20.10+)
2. **Docker Compose** (v2.0+)
3. **Git**

Check installations:
```bash
docker --version
docker compose version
```

---

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Navigate to docker directory
cd docker

# Copy environment template
cp ../.env.docker ../.env

# Edit .env and set your API_KEY
nano ../.env
```

**Important:** Make sure both `API_KEY` and `NEXT_PUBLIC_API_KEY` match!

### 2. Start Development Environment

```bash
# Start all services
./start-dev.sh
```

Or manually:
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. Access Services

- **Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/health

---

## 🔧 Development Workflow

### Hot Reload

Both services support hot reload:

**Backend:**
- Edit files in `/runtime/server/` or `/src/`
- Changes reflect immediately via `nodemon`

**Dashboard:**
- Edit files in `/dashboard/src/`
- Next.js dev server auto-reloads

### View Logs

```bash
# All services
./logs.sh

# Specific service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f dashboard
```

### Stop Services

```bash
./stop-dev.sh
```

Or manually:
```bash
docker compose -f docker-compose.dev.yml down
```

### Rebuild After Changes

```bash
./rebuild.sh
```

This rebuilds images and restarts services (useful after package.json changes).

---

## 🌐 Networking

### Container-to-Container Communication

Services communicate using Docker service names:
- Dashboard → Backend: `http://backend:8080`
- Backend → Dashboard: `http://dashboard:3000`

### Browser Access

When accessing from your browser:
- Use `http://localhost:8080` for API
- Use `ws://localhost:8080` for WebSocket

### Environment Variables

The setup uses different URLs for different contexts:

**Browser (Client-Side):**
```env
NEXT_PUBLIC_BROWSER_API_URL=http://localhost:8080
NEXT_PUBLIC_BROWSER_WS_URL=ws://localhost:8080
```

**Server-Side (SSR):**
```env
NEXT_PUBLIC_API_URL=http://backend:8080
NEXT_PUBLIC_WS_URL=ws://backend:8080
```

This is handled automatically by `client.js` and `useWebSocket.js`.

---

## 📦 Volumes

Persistent data is stored in Docker volumes:

| Volume | Purpose | Location in Container |
|--------|---------|---------------------|
| `waqtor-sessions` | WhatsApp sessions | `/app/.wwebjs_auth` |
| `waqtor-cache` | WhatsApp cache | `/app/.wwebjs_cache` |
| `waqtor-logs` | Application logs | `/app/runtime/logs` |
| `waqtor-uploads` | Uploaded files | `/app/uploads` |

### Inspect Volumes

```bash
# List volumes
docker volume ls | grep waqtor

# Inspect a volume
docker volume inspect waqtor-sessions

# View volume data
docker run --rm -v waqtor-sessions:/data alpine ls -la /data
```

### Clear Data

```bash
# Stop services
./stop-dev.sh

# Remove volumes (WARNING: Deletes all data!)
docker volume rm waqtor-sessions waqtor-cache waqtor-logs waqtor-uploads
```

---

## 🐛 Debugging

### Backend Not Starting

1. Check logs:
```bash
docker compose -f docker-compose.dev.yml logs backend
```

2. Common issues:
   - Port 8080 already in use
   - Missing API_KEY in .env
   - Chromium dependencies missing (should be in Dockerfile)

### Dashboard Not Connecting

1. Check if backend is healthy:
```bash
curl http://localhost:8080/health
```

2. Verify environment variables:
```bash
docker compose -f docker-compose.dev.yml exec dashboard env | grep NEXT_PUBLIC
```

3. Check network connectivity:
```bash
docker compose -f docker-compose.dev.yml exec dashboard ping backend
```

### WebSocket Issues

1. Check WebSocket URL in browser console
2. Verify API key matches between frontend and backend
3. Check CORS settings in backend

### Hot Reload Not Working

1. Ensure volumes are mounted correctly:
```bash
docker compose -f docker-compose.dev.yml exec backend ls -la /app/runtime/server
docker compose -f docker-compose.dev.yml exec dashboard ls -la /app/src
```

2. Enable polling (already in docker-compose.dev.yml):
```env
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:8080/health

# Get status
curl -H "x-api-key: your-api-key" http://localhost:8080/api/status

# Test WebSocket (using websocat)
websocat ws://localhost:8080?apiKey=your-api-key
```

### Test Dashboard

```bash
# Access in browser
open http://localhost:3000

# Check build
docker compose -f docker-compose.dev.yml exec dashboard npm run build
```

---

## 📊 Performance

### Container Stats

```bash
docker stats waqtor-backend-dev waqtor-dashboard-dev
```

### Resource Limits

To add resource limits, edit `docker-compose.dev.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

---

## 🔒 Security

### Production Considerations

1. **Change default API key** in `.env`
2. **Use secrets** instead of environment variables
3. **Enable HTTPS** with nginx or reverse proxy
4. **Limit CORS** to specific domains
5. **Run as non-root user** (add to Dockerfiles)

### Environment Variables

Never commit `.env` files! They are in `.gitignore`.

For production, use:
- Docker secrets
- Kubernetes secrets
- Environment variable injection in CI/CD

---

## 🔄 Updates

### Update Dependencies

```bash
# Backend
docker compose -f docker-compose.dev.yml exec backend npm update
docker compose -f docker-compose.dev.yml exec backend npm audit fix

# Dashboard
docker compose -f docker-compose.dev.yml exec dashboard npm update
docker compose -f docker-compose.dev.yml exec dashboard npm audit fix

# Rebuild
./rebuild.sh
```

### Update Base Images

```bash
# Pull latest images
docker compose -f docker-compose.dev.yml pull

# Rebuild
./rebuild.sh
```

---

## 📝 Helper Scripts

| Script | Purpose |
|--------|---------|
| `start-dev.sh` | Start development environment |
| `stop-dev.sh` | Stop all services |
| `logs.sh` | View logs for all services |
| `rebuild.sh` | Rebuild and restart services |

---

## 🎯 Next Steps

1. **Phase 3 Integration:**
   - Test full backend API integration
   - Add global notifications system
   - Implement error boundaries on all pages
   - Add analytics/reports page

2. **Production Setup:**
   - Create production docker-compose.yml
   - Add nginx reverse proxy
   - Configure SSL/TLS
   - Set up monitoring and logging

3. **Documentation:**
   - Update main README
   - Create deployment guide
   - Add troubleshooting section

---

## 🆘 Support

### Common Commands

```bash
# Restart a service
docker compose -f docker-compose.dev.yml restart backend

# Execute command in container
docker compose -f docker-compose.dev.yml exec backend npm run test

# View service health
docker compose -f docker-compose.dev.yml ps

# Clean everything
docker compose -f docker-compose.dev.yml down -v
docker system prune -a
```

### Logs Location

- **Container logs:** `docker compose logs`
- **Backend logs:** Volume `waqtor-logs` → `/app/runtime/logs`
- **Dashboard logs:** Console output only (dev mode)

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Happy Coding! 🚀**
