# 🐳 Running Waqtor with Docker - Quick Guide

## ✅ Done! Files are Ready

The `docker-compose.yml` file is in the root directory and supports:

- ✅ Backend API (Port 8080)
- ✅ Dashboard (Port 3000)
- ✅ Hot Reload for development
- ✅ Volumes for persistent data

## 🚀 Quick Start (3 Steps)

### 1️⃣ Make sure Docker Desktop is running

### 2️⃣ Run the script

```bash
./start-docker.sh
```

### 3️⃣ Choose the mode

- Choose `1` for Development mode (recommended)

## 🌐 Access Services

After startup:

- **Backend**: <http://localhost:8080>
- **Dashboard**: <http://localhost:3000>

## 📝 Useful Commands

```bash
# View services status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🔧 Configuration

Settings are in `.env.docker` - you can copy it:

```bash
cp .env.docker .env
```

Important settings:

- `API_KEY`: API key (must match in Backend and Dashboard)
- `NEXT_PUBLIC_BROWSER_API_URL`: Backend URL for browser

## 📚 More Details

See `DOCKER_QUICKSTART.md` for complete details.

---

**Note**: Files are updated and ready to use! 🎉
