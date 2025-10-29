# 🐳 Docker Setup Complete!

## ✅ What Was Created

### Docker Files (11 files)

#### Core Configuration
1. ✅ `docker/Dockerfile.backend` - Backend container
2. ✅ `docker/Dockerfile.dashboard` - Dashboard container
3. ✅ `docker/docker-compose.dev.yml` - Development setup
4. ✅ `docker-compose.yml` - Production setup (root)
5. ✅ `docker/nginx.conf` - Nginx reverse proxy config
6. ✅ `docker/.dockerignore` - Ignore patterns
7. ✅ `.env.docker` - Environment template

#### Helper Scripts
8. ✅ `docker/start-dev.sh` - Start development environment
9. ✅ `docker/stop-dev.sh` - Stop services
10. ✅ `docker/logs.sh` - View logs
11. ✅ `docker/rebuild.sh` - Rebuild containers

#### Documentation
12. ✅ `docker/README.md` - Complete Docker guide (EN)
13. ✅ `docker/README_AR.md` - Quick guide (AR)
14. ✅ `DOCKER_SETUP_SUMMARY.md` - This file

---

## 🎯 Quick Start

### 1. Setup Environment

```bash
# Copy environment file
cp .env.docker .env

# Edit and set your API_KEY
nano .env
```

### 2. Start Services

```bash
# Start in background
cd docker
./start-dev.sh -d

# Or start with logs
./start-dev.sh
```

### 3. Access

- **Backend API:** http://localhost:8080
- **Dashboard:** http://localhost:3000
- **Health Check:** http://localhost:8080/health

---

## 📦 Services

### Backend (Port 8080)
- **Container:** `waqtor-backend-dev`
- **Image:** Node.js 18 Alpine + Chromium
- **Features:**
  - Hot reload enabled
  - WhatsApp Web integration
  - REST API endpoints
  - WebSocket support
  - Error handling system

### Dashboard (Port 3000)
- **Container:** `waqtor-dashboard-dev`
- **Image:** Node.js 18 Alpine
- **Features:**
  - Next.js with Fast Refresh
  - Hot reload enabled
  - PrimeReact UI
  - Real-time updates
  - Error management

### Nginx (Port 80) - Optional
- **Container:** `waqtor-nginx`
- **Features:**
  - Reverse proxy
  - Rate limiting
  - SSL/TLS ready
  - Load balancing

---

## 🔧 Common Commands

### Start/Stop

```bash
# Start (detached)
./docker/start-dev.sh -d

# Start (with logs)
./docker/start-dev.sh

# Stop
./docker/stop-dev.sh

# Stop and remove volumes
./docker/stop-dev.sh -v
```

### View Logs

```bash
# All logs
./docker/logs.sh

# Backend only
./docker/logs.sh backend

# Dashboard only
./docker/logs.sh dashboard
```

### Rebuild

```bash
# Rebuild
./docker/rebuild.sh

# Clean rebuild
./docker/rebuild.sh --clean
```

### Direct Docker Compose

```bash
# Start
docker-compose -f docker/docker-compose.dev.yml up -d

# Stop
docker-compose -f docker/docker-compose.dev.yml down

# Logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Restart service
docker-compose -f docker/docker-compose.dev.yml restart backend
```

---

## 📊 Volumes

Persistent data stored in Docker volumes:

| Volume | Description | Path |
|--------|-------------|------|
| `waqtor-sessions` | WhatsApp sessions | `/app/.wwebjs_auth` |
| `waqtor-cache` | WhatsApp cache | `/app/.wwebjs_cache` |
| `waqtor-logs` | Application logs | `/app/runtime/logs` |
| `waqtor-uploads` | Uploaded files | `/app/uploads` |

### Backup Volumes

```bash
# Backup sessions
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar czf /backup/sessions-backup.tar.gz -C /data .

# Restore sessions
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar xzf /backup/sessions-backup.tar.gz -C /data
```

---

## 🔄 Hot Reload

### Backend
- Changes to `/runtime` and `/src` trigger auto-reload
- No container rebuild needed
- Uses nodemon (if configured)

### Dashboard
- Changes to `/dashboard` trigger Next.js Fast Refresh
- No container rebuild needed
- Environment: `WATCHPACK_POLLING=true`

---

## 🌐 Network Architecture

```
┌─────────────────────────────────────┐
│         Docker Network              │
│         waqtor-network              │
│                                     │
│  ┌────────────┐  ┌──────────────┐  │
│  │  Backend   │  │  Dashboard   │  │
│  │  :8080     │◄─┤  :3000       │  │
│  └────────────┘  └──────────────┘  │
│         │                           │
│         ▼                           │
│  ┌────────────┐                    │
│  │   Nginx    │                    │
│  │   :80      │ (optional)         │
│  └────────────┘                    │
│                                     │
└─────────────────────────────────────┘
         │
         ▼
    Host Machine
    localhost:8080 (Backend)
    localhost:3000 (Dashboard)
    localhost:80   (Nginx)
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8080
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Container Won't Start

```bash
# Check logs
./docker/logs.sh backend

# Rebuild from scratch
./docker/stop-dev.sh -v
./docker/rebuild.sh --clean
./docker/start-dev.sh
```

### WhatsApp Not Connecting

```bash
# Check backend logs
./docker/logs.sh backend

# Access container
docker exec -it waqtor-backend-dev sh

# Check session files
ls -la /app/.wwebjs_auth
```

### Dashboard Can't Connect

```bash
# Check environment
docker exec -it waqtor-dashboard-dev env | grep NEXT_PUBLIC

# Test backend
curl http://localhost:8080/health

# Ping backend from dashboard
docker exec -it waqtor-dashboard-dev ping backend
```

---

## 🔒 Security

### Environment Variables

**Never commit `.env` file!**

Generate secure API key:

```bash
# Method 1
openssl rand -hex 32

# Method 2
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Production Checklist

- [ ] Change default API_KEY
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Use Docker secrets
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Backup volumes

---

## 📈 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:8080/health

# Container status
docker ps --filter "name=waqtor"

# Resource usage
docker stats waqtor-backend-dev waqtor-dashboard-dev
```

### Logs

```bash
# Real-time logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Last 100 lines
docker-compose -f docker/docker-compose.dev.yml logs --tail=100

# Specific service
docker-compose -f docker/docker-compose.dev.yml logs -f backend
```

---

## 🚀 Development Workflow

### Typical Day

```bash
# 1. Start
./docker/start-dev.sh -d

# 2. Check status
curl http://localhost:8080/health

# 3. Develop (hot reload automatic)

# 4. Test
open http://localhost:3000

# 5. Check logs
./docker/logs.sh

# 6. Stop
./docker/stop-dev.sh
```

### Making Changes

#### Backend Changes
1. Edit files in `/runtime` or `/src`
2. Changes reload automatically
3. Check logs: `./docker/logs.sh backend`

#### Dashboard Changes
1. Edit files in `/dashboard`
2. Next.js Fast Refresh triggers
3. Refresh browser

#### Dependency Changes
1. Update `package.json`
2. Rebuild: `./docker/rebuild.sh`
3. Restart: `./docker/start-dev.sh`

---

## 📚 Documentation

- **[Complete Guide (EN)](docker/README.md)** - Full documentation
- **[Quick Guide (AR)](docker/README_AR.md)** - Arabic quick reference

---

## ✅ Features

### ✅ Development
- Hot reload (backend & dashboard)
- Source code mounting
- Fast iteration
- Easy debugging
- Persistent volumes

### ✅ Production Ready
- Nginx reverse proxy
- Health checks
- Rate limiting
- SSL/TLS support
- Security headers

### ✅ Developer Experience
- One-command start
- Helper scripts
- Clear documentation
- Troubleshooting guide
- Volume backup

---

## 📊 File Structure

```
.
├── docker/
│   ├── Dockerfile.backend        # Backend image
│   ├── Dockerfile.dashboard      # Dashboard image
│   ├── docker-compose.dev.yml    # Development
│   ├── nginx.conf                # Nginx config
│   ├── .dockerignore            # Ignore patterns
│   ├── README.md                # Complete guide
│   ├── README_AR.md             # Arabic guide
│   ├── start-dev.sh             # Start script
│   ├── stop-dev.sh              # Stop script
│   ├── logs.sh                  # Logs script
│   └── rebuild.sh               # Rebuild script
├── docker-compose.yml            # Production (root)
├── .env.docker                   # Env template
└── DOCKER_SETUP_SUMMARY.md      # This file
```

---

## 🎉 Summary

**Docker setup is complete and ready!**

### Created
- ✅ 14 files total
- ✅ 2 Dockerfiles
- ✅ 2 docker-compose files
- ✅ 4 helper scripts
- ✅ 3 documentation files

### Features
- ✅ Hot reload for development
- ✅ Persistent data volumes
- ✅ Health checks
- ✅ Nginx reverse proxy (optional)
- ✅ Complete documentation

### Next Steps
1. Setup environment: `cp .env.docker .env`
2. Set API key in `.env`
3. Start services: `./docker/start-dev.sh -d`
4. Access dashboard: http://localhost:3000

**Status:** ✅ **Ready for Development!**

---

**Created:** 2025  
**Version:** 1.0.0  
**Docker:** 24.x  
**Docker Compose:** 2.x
