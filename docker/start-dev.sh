#!/bin/bash

# Waqtor Development - Start Script
# Starts backend and dashboard in Docker for development

set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Waqtor Development Environment${NC}"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if .env exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp "$PROJECT_ROOT/.env.docker" "$PROJECT_ROOT/.env"
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit $PROJECT_ROOT/.env and set your API_KEY${NC}"
    echo ""
fi

# Check if ports are available
echo "Checking ports..."

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}❌ Port 8080 is already in use${NC}"
    echo "   Please stop the service using port 8080"
    exit 1
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}❌ Port 3001 is already in use${NC}"
    echo "   Please stop the service using port 3001"
    exit 1
fi

echo -e "${GREEN}✅ Ports 8080 and 3001 are available${NC}"
echo ""

# Pull latest images (optional)
if [ "$1" = "--pull" ]; then
    echo "Pulling latest base images..."
    docker-compose -f "$SCRIPT_DIR/docker-compose.dev.yml" pull
    echo -e "${GREEN}✅ Images pulled${NC}"
    echo ""
fi

# Build containers
echo "Building Docker containers..."
docker-compose -f "$SCRIPT_DIR/docker-compose.dev.yml" build

echo -e "${GREEN}✅ Containers built${NC}"
echo ""

# Start services
echo "Starting services..."
if [ "$1" = "-d" ] || [ "$2" = "-d" ]; then
    # Detached mode
    docker-compose -f "$SCRIPT_DIR/docker-compose.dev.yml" up -d
    echo ""
    echo -e "${GREEN}✅ Services started in background${NC}"
    echo ""
    echo "View logs with:"
    echo "  docker-compose -f $SCRIPT_DIR/docker-compose.dev.yml logs -f"
else
    # Foreground mode
    echo ""
    echo -e "${BLUE}Press Ctrl+C to stop${NC}"
    echo ""
    docker-compose -f "$SCRIPT_DIR/docker-compose.dev.yml" up
fi

echo ""
echo -e "${GREEN}🎉 Waqtor Development Environment is ready!${NC}"
echo ""
echo "Access services:"
echo -e "  ${BLUE}Backend API:${NC}    http://localhost:8080"
echo -e "  ${BLUE}Dashboard:${NC}      http://localhost:3001"
echo -e "  ${BLUE}Health Check:${NC}   http://localhost:8080/health"
echo ""
echo "Useful commands:"
echo "  docker-compose -f $SCRIPT_DIR/docker-compose.dev.yml logs -f"
echo "  docker-compose -f $SCRIPT_DIR/docker-compose.dev.yml down"
echo "  docker-compose -f $SCRIPT_DIR/docker-compose.dev.yml restart"
echo ""
