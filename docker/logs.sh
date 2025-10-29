#!/bin/bash

# Waqtor Docker - Logs Script
# View logs from Docker containers

set -e

# Colors
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Viewing Waqtor Logs${NC}"
echo "======================"
echo ""

# Check which service to show
case "$1" in
    backend|api)
        echo "Showing backend logs..."
        docker-compose -f docker/docker-compose.dev.yml logs -f backend
        ;;
    dashboard|frontend)
        echo "Showing dashboard logs..."
        docker-compose -f docker/docker-compose.dev.yml logs -f dashboard
        ;;
    all|"")
        echo "Showing all logs..."
        docker-compose -f docker/docker-compose.dev.yml logs -f
        ;;
    *)
        echo "Usage: ./logs.sh [backend|dashboard|all]"
        echo ""
        echo "Examples:"
        echo "  ./logs.sh backend    # Show backend logs"
        echo "  ./logs.sh dashboard  # Show dashboard logs"
        echo "  ./logs.sh           # Show all logs"
        exit 1
        ;;
esac
