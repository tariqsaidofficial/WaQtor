#!/bin/bash

# Waqtor - Docker Quick Start
# Starts Backend & Dashboard together using Docker Compose

echo "🐳 Waqtor - Docker Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running"
    echo "Please start Docker Desktop"
    exit 1
fi

echo "✅ Docker is ready"
echo ""

# Display options
echo "Choose startup mode:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
echo "3) Stop services"
echo "4) Rebuild"
echo ""
read -p "Your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting Development mode..."
        echo ""
        docker-compose up -d
        echo ""
        echo "✅ Services are now running!"
        echo ""
        echo "📱 Backend API: http://localhost:8080"
        echo "🖥️  Dashboard: http://localhost:3000"
        echo ""
        echo "View logs: docker-compose logs -f"
        echo "Stop services: ./start-docker.sh (choose 3)"
        ;;
    2)
        echo ""
        echo "🏭 Starting Production mode..."
        echo ""
        docker-compose -f docker/docker-compose.yml up -d
        echo ""
        echo "✅ Services are now running!"
        echo ""
        echo "📱 Backend API: http://localhost:8080"
        ;;
    3)
        echo ""
        echo "⏹️  Stopping services..."
        docker-compose down
        echo ""
        echo "✅ All services stopped"
        ;;
    4)
        echo ""
        echo "🔨 Rebuilding..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo ""
        echo "✅ Rebuild and restart completed!"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
