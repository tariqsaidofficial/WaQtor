#!/bin/bash

# Error Handling System Test Script
# Tests backend and frontend error handling

echo "🧪 Testing Error Handling System..."
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config
API_URL="http://localhost:8080"
API_KEY="${API_KEY:-test-api-key-123}"

echo ""
echo "📋 Configuration:"
echo "   API URL: $API_URL"
echo "   API Key: $API_KEY"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
if [ "$response" == "200" ]; then
    echo -e "${GREEN}   ✅ Health check passed${NC}"
else
    echo -e "${RED}   ❌ Health check failed (HTTP $response)${NC}"
fi

# Test 2: Error Stats (should fail without auth)
echo ""
echo "2️⃣  Testing Error Stats Endpoint (no auth - should fail)..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/errors/stats")
if [ "$response" == "401" ] || [ "$response" == "403" ]; then
    echo -e "${GREEN}   ✅ Correctly rejected without auth${NC}"
else
    echo -e "${YELLOW}   ⚠️  Unexpected response (HTTP $response)${NC}"
fi

# Test 3: Error Stats (with auth)
echo ""
echo "3️⃣  Testing Error Stats Endpoint (with auth)..."
response=$(curl -s -w "\n%{http_code}" -H "X-API-Key: $API_KEY" "$API_URL/api/errors/stats?timeRange=day")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}   ✅ Error stats retrieved successfully${NC}"
    echo "   Response: $body" | head -c 100
    echo "..."
else
    echo -e "${RED}   ❌ Failed to get error stats (HTTP $http_code)${NC}"
    echo "   Response: $body"
fi

# Test 4: Recent Errors
echo ""
echo "4️⃣  Testing Recent Errors Endpoint..."
response=$(curl -s -w "\n%{http_code}" -H "X-API-Key: $API_KEY" "$API_URL/api/errors/recent?limit=5")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}   ✅ Recent errors retrieved successfully${NC}"
    echo "   Response: $body" | head -c 100
    echo "..."
else
    echo -e "${RED}   ❌ Failed to get recent errors (HTTP $http_code)${NC}"
fi

# Test 5: 404 Handler
echo ""
echo "5️⃣  Testing 404 Handler..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/nonexistent")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "404" ]; then
    echo -e "${GREEN}   ✅ 404 handler working correctly${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}   ❌ 404 handler not working (HTTP $http_code)${NC}"
fi

# Test 6: Validation Error
echo ""
echo "6️⃣  Testing Validation Error Handling..."
response=$(curl -s -w "\n%{http_code}" \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$API_URL/api/messages/send-text")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "400" ]; then
    echo -e "${GREEN}   ✅ Validation error handled correctly${NC}"
    echo "   Response: $body" | head -c 100
    echo "..."
else
    echo -e "${YELLOW}   ⚠️  Unexpected response (HTTP $http_code)${NC}"
    echo "   Response: $body"
fi

# Test 7: Log Frontend Error
echo ""
echo "7️⃣  Testing Frontend Error Logging..."
response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "error": {
            "message": "Test error from script",
            "code": "TEST_ERROR",
            "statusCode": 500,
            "stack": "Error: Test error\n    at test.sh:123"
        },
        "context": {
            "source": "test-script",
            "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
        }
    }' \
    "$API_URL/api/errors/log")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}   ✅ Frontend error logged successfully${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}   ❌ Failed to log frontend error (HTTP $http_code)${NC}"
    echo "   Response: $body"
fi

# Summary
echo ""
echo "=================================="
echo "✅ Error Handling System Test Complete!"
echo ""
echo "📝 Manual Tests Required:"
echo "   1. Check error logs: runtime/logs/errors.json"
echo "   2. Visit Error Dashboard: http://localhost:3000/error-management"
echo "   3. Test Error Boundaries in frontend"
echo "   4. Trigger various errors and check monitoring"
echo ""
echo "📚 Documentation:"
echo "   - Complete Guide: documentation/ERROR_HANDLING_COMPLETE_GUIDE.md"
echo "   - Quick Reference: documentation/ERROR_HANDLING_README.md"
echo ""
