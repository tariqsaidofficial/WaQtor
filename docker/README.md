# Waqtor Docker Setup

## 🚀 Quick Start

### Development Mode (Recommended)

```bash
# 1. Setup environment
cp .env.docker .env

# 2. Edit .env and set your API_KEY
nano .env

# 3. Start both backend and dashboard
docker-compose -f docker/docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker/docker-compose.dev.yml up -d

# 4. Access services
# Backend: http://localhost:8080
# Dashboard: http://localhost:3000
# Health: http://localhost:8080/health
```

### Production Mode (with Nginx)

```bash
# Start all services including nginx
docker-compose up --profile production

# Backend: http://localhost:8080 (direct)
# Dashboard: http://localhost:3000 (direct)
# Proxy: http://localhost:80 (nginx)
```

---

## 📁 File Structure

```
docker/
├── Dockerfile.backend        # Backend container
├── Dockerfile.dashboard      # Dashboard container
├── docker-compose.dev.yml    # Development setup
├── nginx.conf                # Nginx configuration
└── .dockerignore            # Ignore patterns

docker-compose.yml            # Production setup (root)
.env.docker                   # Environment template
```

---

## 🔧 Available Commands

### Start Services

```bash
# Development (hot reload enabled)
docker-compose -f docker/docker-compose.dev.yml up

# Production (with nginx)
docker-compose up --profile production

# Background mode
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Stop Services

```bash
# Stop all containers
docker-compose -f docker/docker-compose.dev.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker/docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker-compose -f docker/docker-compose.dev.yml logs -f

# Backend only
docker-compose -f docker/docker-compose.dev.yml logs -f backend

# Dashboard only
docker-compose -f docker/docker-compose.dev.yml logs -f dashboard
```

### Rebuild Containers

```bash
# Rebuild all
docker-compose -f docker/docker-compose.dev.yml build

# Rebuild backend only
docker-compose -f docker/docker-compose.dev.yml build backend

# Rebuild and start
docker-compose -f docker/docker-compose.dev.yml up --build
```

### Execute Commands

```bash
# Backend shell
docker exec -it waqtor-backend-dev sh

# Dashboard shell
docker exec -it waqtor-dashboard-dev sh

# Run npm command in backend
docker exec -it waqtor-backend-dev npm run test

# Run npm command in dashboard
docker exec -it waqtor-dashboard-dev npm run build
```

---

## 🌐 Service URLs

### Development Mode

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:8080 | REST API endpoints |
| WebSocket | ws://localhost:8080/ws | Real-time updates |
| Dashboard | http://localhost:3000 | Admin interface |
| Health Check | http://localhost:8080/health | Service status |

### Production Mode (with Nginx)

| Service | URL | Description |
|---------|-----|-------------|
| Nginx Proxy | http://localhost:80 | Reverse proxy |
| Backend API | http://localhost:80/api | Proxied API |
| WebSocket | ws://localhost:80/ws | Proxied WebSocket |
| Dashboard | http://localhost:80 | Proxied dashboard |

---

## 📦 Volumes

### Persistent Data

| Volume | Description | Path |
|--------|-------------|------|
| `waqtor-sessions` | WhatsApp sessions | `/app/.wwebjs_auth` |
| `waqtor-cache` | WhatsApp cache | `/app/.wwebjs_cache` |
| `waqtor-logs` | Application logs | `/app/runtime/logs` |
| `waqtor-uploads` | Uploaded files | `/app/uploads` |

### Managing Volumes

```bash
# List volumes
docker volume ls | grep waqtor

# Inspect volume
docker volume inspect waqtor-sessions

# Remove all volumes (CAUTION: deletes data)
docker-compose -f docker/docker-compose.dev.yml down -v

# Backup volume
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar czf /backup/sessions-backup.tar.gz -C /data .

# Restore volume
docker run --rm -v waqtor-sessions:/data -v $(pwd):/backup \
  alpine tar xzf /backup/sessions-backup.tar.gz -C /data
```

---

## 🔄 Hot Reload

Both backend and dashboard support **hot reload** in development mode:

### Backend
- Changes to `/runtime`, `/src` automatically reload
- No need to rebuild container
- Uses nodemon (if configured)

### Dashboard  
- Changes to `/dashboard` automatically rebuild
- Next.js Fast Refresh enabled
- Environment: `WATCHPACK_POLLING=true`

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f docker/docker-compose.dev.yml logs backend

# Check if ports are in use
lsof -i :8080
lsof -i :3000

# Rebuild from scratch
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.dev.yml build --no-cache
docker-compose -f docker/docker-compose.dev.yml up
```

### WhatsApp not connecting

```bash
# Check backend logs
docker-compose -f docker/docker-compose.dev.yml logs -f backend

# Access backend container
docker exec -it waqtor-backend-dev sh

# Check session files
ls -la /app/.wwebjs_auth
```

### Dashboard can't connect to backend

```bash
# Check environment variables
docker exec -it waqtor-dashboard-dev env | grep NEXT_PUBLIC

# Verify network connectivity
docker exec -it waqtor-dashboard-dev ping backend

# Check backend is running
curl http://localhost:8080/health
```

### Permission issues

```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .

# Or inside container
docker exec -it waqtor-backend-dev chmod -R 777 /app/.wwebjs_auth
```

### Clean slate restart

```bash
# Stop everything
docker-compose -f docker/docker-compose.dev.yml down -v

# Remove all containers
docker rm -f $(docker ps -aq --filter "name=waqtor")

# Remove all volumes
docker volume rm $(docker volume ls -q --filter "name=waqtor")

# Rebuild and start
docker-compose -f docker/docker-compose.dev.yml up --build
```

---

## 🔒 Security

### Environment Variables

**Never commit `.env` file!**

```bash
# Use template
cp .env.docker .env

# Generate secure API key
openssl rand -hex 32

# Update .env
API_KEY=your-generated-key-here
```

### Production Considerations

1. **Change default API key**
2. **Enable HTTPS** (use Let's Encrypt)
3. **Set strong passwords**
4. **Configure firewall rules**
5. **Use Docker secrets** for sensitive data
6. **Regular security updates**

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/health

# Dashboard health (in dev mode, may fail)
curl http://localhost:3000

# Container health status
docker ps --filter "name=waqtor"
```

### Resource Usage

```bash
# Container stats
docker stats waqtor-backend-dev waqtor-dashboard-dev

# Disk usage
docker system df

# Volume sizes
docker system df -v | grep waqtor
```

---

## 🔧 Configuration

### Backend Configuration

Edit `docker/Dockerfile.backend` to:
- Change Node version
- Add system packages
- Modify startup command

### Dashboard Configuration

Edit `docker/Dockerfile.dashboard` to:
- Change Node version
- Add build arguments
- Modify startup command

### Nginx Configuration

Edit `docker/nginx.conf` to:
- Change rate limits
- Add custom headers
- Configure caching
- Add SSL/TLS

---

## 📝 Development Workflow

### Typical Day

```bash
# 1. Start services
docker-compose -f docker/docker-compose.dev.yml up -d

# 2. Check logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# 3. Make code changes (hot reload automatically)

# 4. Test changes
curl http://localhost:8080/api/status/info

# 5. View in browser
open http://localhost:3000

# 6. Stop when done
docker-compose -f docker/docker-compose.dev.yml down
```

### Making Changes

1. **Backend changes:** Edit files in `/runtime` or `/src`
2. **Dashboard changes:** Edit files in `/dashboard`
3. **Environment changes:** Edit `.env` and restart containers
4. **Dependency changes:** Rebuild containers

---

## 🚀 Deployment

### Build for Production

```bash
# Build production images
docker-compose build

# Start in production mode
docker-compose up -d

# With nginx
docker-compose --profile production up -d
```

### Docker Hub (Optional)

```bash
# Tag images
docker tag waqtor-backend:latest your-username/waqtor-backend:1.0.0
docker tag waqtor-dashboard:latest your-username/waqtor-dashboard:1.0.0

# Push to Docker Hub
docker push your-username/waqtor-backend:1.0.0
docker push your-username/waqtor-dashboard:1.0.0
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ✅ Checklist

Before starting:
- [ ] Copy `.env.docker` to `.env`
- [ ] Set secure `API_KEY` in `.env`
- [ ] Ensure ports 8080 and 3000 are free
- [ ] Install Docker and Docker Compose
- [ ] Have at least 2GB free RAM

For production:
- [ ] Use production `.env` values
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backups for volumes
- [ ] Enable firewall rules
- [ ] Review security settings

---

**Last Updated:** 2025  
**Docker Version:** 24.x  
**Docker Compose Version:** 2.x
