#!/bin/bash

# Waqtor Dashboard - Quick Start Script
# This script helps you start the Waqtor dashboard quickly

echo "🚀 Waqtor Dashboard Quick Start"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the dashboard directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update VITE_API_KEY in .env before continuing"
    echo ""
    read -p "Press Enter after updating .env..."
fi

# Start the development server
echo "🌐 Starting development server..."
echo "Dashboard will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
