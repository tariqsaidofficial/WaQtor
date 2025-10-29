#!/bin/bash

# Waqtor Docker Setup Verification Script
# يتحقق من أن جميع الملفات والإعدادات جاهزة

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Waqtor Docker Setup Verification${NC}"
echo "========================================"
echo ""

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 ${RED}(MISSING)${NC}"
        ((ERRORS++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ ${RED}(MISSING)${NC}"
        ((ERRORS++))
        return 1
    fi
}

# Function to check executable
check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 ${GREEN}(executable)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️${NC}  $1 ${YELLOW}(not executable)${NC}"
        ((WARNINGS++))
        return 1
    fi
}

echo -e "${BLUE}📁 Checking Docker Configuration Files...${NC}"
check_file "docker/Dockerfile.backend"
check_file "docker/Dockerfile.dashboard"
check_file "docker/docker-compose.dev.yml"
check_file "docker/docker-compose.yml"
check_file "docker/.dockerignore"
echo ""

echo -e "${BLUE}📜 Checking Shell Scripts...${NC}"
check_executable "docker/start-dev.sh"
check_executable "docker/stop-dev.sh"
check_executable "docker/logs.sh"
check_executable "docker/rebuild.sh"
echo ""

echo -e "${BLUE}⚙️  Checking Environment Files...${NC}"
check_file ".env.docker"

if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env ${GREEN}(exists)${NC}"
    
    # Check if API_KEY is set
    if grep -q "API_KEY=your-secure-api-key-here" .env; then
        echo -e "${YELLOW}⚠️${NC}  .env has default API_KEY ${YELLOW}(needs update)${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅${NC} .env has custom API_KEY"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  .env ${YELLOW}(will be created on first run)${NC}"
    ((WARNINGS++))
fi
echo ""

echo -e "${BLUE}📂 Checking Source Directories...${NC}"
check_dir "src"
check_dir "runtime"
check_dir "dashboard"
check_dir "dashboard/app"
check_dir "dashboard/src"
echo ""

echo -e "${BLUE}📦 Checking Package Files...${NC}"
check_file "package.json"
check_file "dashboard/package.json"
echo ""

echo -e "${BLUE}🐳 Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅${NC} Docker CLI installed"
    
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Docker daemon is running"
        
        # Check Docker version
        DOCKER_VERSION=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1)
        echo -e "${GREEN}✅${NC} Docker version: $DOCKER_VERSION"
    else
        echo -e "${RED}❌${NC} Docker daemon is not running"
        ((ERRORS++))
    fi
    
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅${NC} Docker Compose installed"
        COMPOSE_VERSION=$(docker-compose --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1)
        echo -e "${GREEN}✅${NC} Docker Compose version: $COMPOSE_VERSION"
    else
        echo -e "${RED}❌${NC} Docker Compose not found"
        ((ERRORS++))
    fi
else
    echo -e "${RED}❌${NC} Docker not installed"
    ((ERRORS++))
fi
echo ""

echo -e "${BLUE}🔌 Checking Ports...${NC}"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️${NC}  Port 8080 is in use"
    echo -e "   ${YELLOW}Process:${NC} $(lsof -Pi :8080 -sTCP:LISTEN | tail -n 1 | awk '{print $1}')"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅${NC} Port 8080 is available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️${NC}  Port 3000 is in use"
    echo -e "   ${YELLOW}Process:${NC} $(lsof -Pi :3000 -sTCP:LISTEN | tail -n 1 | awk '{print $1}')"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅${NC} Port 3000 is available"
fi
echo ""

echo -e "${BLUE}💾 Checking Disk Space...${NC}"
AVAILABLE_GB=$(df -h . | awk 'NR==2 {print $4}' | sed 's/Gi//' | sed 's/G//')
echo -e "${GREEN}✅${NC} Available disk space: $(df -h . | awk 'NR==2 {print $4}')"

if [ "${AVAILABLE_GB%.*}" -lt 2 ]; then
    echo -e "${YELLOW}⚠️${NC}  Low disk space (recommended: at least 2GB)"
    ((WARNINGS++))
fi
echo ""

echo "========================================"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "========================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Perfect! Everything is ready!${NC}"
    echo ""
    echo -e "${GREEN}🚀 You can now run:${NC}"
    echo -e "   cd docker"
    echo -e "   ./start-dev.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Setup is OK with $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "${YELLOW}📝 Recommendations:${NC}"
    
    if [ ! -x "docker/start-dev.sh" ]; then
        echo -e "   • Run: ${BLUE}chmod +x docker/*.sh${NC}"
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "   • .env will be created automatically on first run"
    fi
    
    if grep -q "API_KEY=your-secure-api-key-here" .env 2>/dev/null; then
        echo -e "   • Update API_KEY in .env file"
    fi
    
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 || lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "   • Stop processes using ports 8080 or 3000"
    fi
    
    echo ""
    echo -e "${GREEN}🚀 You can still run:${NC}"
    echo -e "   cd docker"
    echo -e "   ./start-dev.sh"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "${RED}🔧 Please fix the following:${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "   • Install Docker Desktop"
    elif ! docker info > /dev/null 2>&1; then
        echo -e "   • Start Docker Desktop"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "   • Install Docker Compose"
    fi
    
    echo ""
    echo -e "${BLUE}📚 For help, see:${NC}"
    echo -e "   • DOCKER_QUICK_START.md"
    echo -e "   • documentation/DOCKER_SETUP_GUIDE.md"
    exit 1
fi
