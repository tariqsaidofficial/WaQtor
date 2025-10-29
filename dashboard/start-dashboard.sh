#!/bin/bash

# Waqtor Dashboard - Quick Start Script
# This script helps you quickly start the dashboard

echo "🚀 Waqtor Dashboard - Quick Start"
echo "=================================="
echo ""

# Check if we're in the dashboard directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in dashboard directory"
    echo "Please run this script from: /Users/sunmarke/Downloads/Waqtor-main/dashboard"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your API key"
    echo ""
fi

# Display configuration
echo "📋 Configuration:"
echo "=================="
if [ -f ".env" ]; then
    grep "^NEXT_PUBLIC" .env || echo "No configuration found"
fi
echo ""

# Ask user if they want to continue
echo "🎯 Ready to start the dashboard!"
echo ""
echo "Before starting, make sure:"
echo "1. ✅ Backend server is running (port 8080)"
echo "2. ✅ .env file is configured"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Start the development server
echo ""
echo "🚀 Starting dashboard..."
echo "Dashboard will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
