#!/bin/bash

# Waqtor Docker - Stop Script
# Stops all Docker services

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Waqtor Services${NC}"
echo "==============================="
echo ""

# Ask if user wants to remove volumes
if [ "$1" = "-v" ] || [ "$1" = "--volumes" ]; then
    echo -e "${YELLOW}⚠️  This will also remove all data volumes${NC}"
    echo "   (sessions, cache, logs, uploads)"
    echo ""
    read -p "Are you sure? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping and removing volumes..."
        docker-compose -f docker/docker-compose.dev.yml down -v
        echo -e "${GREEN}✅ Services stopped and volumes removed${NC}"
    else
        echo "Cancelled"
        exit 0
    fi
else
    echo "Stopping services..."
    docker-compose -f docker/docker-compose.dev.yml down
    echo -e "${GREEN}✅ Services stopped${NC}"
    echo -e "${BLUE}ℹ️  Volumes preserved. Use -v to remove them.${NC}"
fi

echo ""
