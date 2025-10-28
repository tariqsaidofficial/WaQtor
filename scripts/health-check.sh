#!/bin/bash

# Waqtor - Quick Health Check Script
# This script tests all major components of the Waqtor system

echo "🚀 Waqtor Health Check"
echo "====================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:8080}"
API_KEY="${API_KEY:-waqtor_default_key_change_me_in_production}"

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expect_auth=$5
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        if [ "$expect_auth" = "true" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -H "X-API-Key: $API_KEY" "$API_URL$endpoint")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
        fi
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -H "X-API-Key: $API_KEY" \
            -d "$data" \
            "$API_URL$endpoint")
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $response)"
        ((FAILED++))
    fi
}

# Test 1: Server is running
echo "1️⃣  Testing Server Status"
echo "------------------------"
test_endpoint "Health Check" "GET" "/health" "" "false"
echo ""

# Test 2: API Root
echo "2️⃣  Testing API Root"
echo "-------------------"
test_endpoint "API Root" "GET" "/api" "" "false"
echo ""

# Test 3: Authentication
echo "3️⃣  Testing Authentication"
echo "-------------------------"
echo -n "Testing: Authentication Required... "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/status/client")
if [ "$response" = "401" ]; then
    echo -e "${GREEN}✅ PASSED${NC} (Correctly requires auth)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} (Should return 401 without API key)"
    ((FAILED++))
fi
echo ""

# Test 4: Status Endpoints
echo "4️⃣  Testing Status Endpoints"
echo "---------------------------"
test_endpoint "Client Status" "GET" "/api/status/client" "" "true"
test_endpoint "Client Info" "GET" "/api/status/info" "" "true"
echo ""

# Test 5: Test Configuration
echo "5️⃣  Testing Test Configuration"
echo "-----------------------------"
test_endpoint "Test Info" "GET" "/api/test/info" "" "true"
echo ""

# Test 6: Campaign Endpoints
echo "6️⃣  Testing Campaign Endpoints"
echo "-----------------------------"
test_endpoint "List Campaigns" "GET" "/api/campaigns/list" "" "true"
echo ""

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Waqtor is ready to use.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the errors above.${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Server not running → Run: npm run dev or npm run docker:run"
    echo "  2. Wrong API key → Check your .env file"
    echo "  3. Port conflict → Check if port 8080 is in use"
    exit 1
fi
