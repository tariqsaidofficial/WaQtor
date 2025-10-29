#!/bin/bash

# Waqtor Docker - Rebuild Script
# Rebuild containers from scratch

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔨 Rebuilding Waqtor Containers${NC}"
echo "================================"
echo ""

# Stop services
echo "Stopping services..."
docker-compose -f docker/docker-compose.dev.yml down

# Remove old images
if [ "$1" = "--clean" ]; then
    echo -e "${YELLOW}Removing old images...${NC}"
    docker-compose -f docker/docker-compose.dev.yml rm -f
    docker image prune -f
fi

# Rebuild
echo "Building containers (this may take a while)..."
docker-compose -f docker/docker-compose.dev.yml build --no-cache

echo -e "${GREEN}✅ Containers rebuilt${NC}"
echo ""
echo "Start services with:"
echo "  ./start-dev.sh"
echo ""
