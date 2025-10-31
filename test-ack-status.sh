#!/bin/bash

# 🧪 Test Script for Message ACK Status Flow
# Tests the complete flow: Send → Sent → Delivered → Read

echo "🧪 =========================================="
echo "🧪 Message ACK Status Flow Test"
echo "🧪 =========================================="
echo ""

# Configuration
API_URL="http://localhost:8080"
API_KEY="${API_KEY:-test-api-key-123}"
TEST_PHONE="201273574131"
TEST_MESSAGE="🧪 Test message - $(date '+%Y-%m-%d %H:%M:%S')"

echo "📋 Test Configuration:"
echo "   API URL: $API_URL"
echo "   Test Phone: $TEST_PHONE"
echo "   Message: $TEST_MESSAGE"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if server is running
check_server() {
    echo -e "${BLUE}🔍 Step 1: Checking if server is running...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Server is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not running (HTTP $response)${NC}"
        echo -e "${YELLOW}💡 Please start the server first:${NC}"
        echo "   cd runtime && npm start"
        return 1
    fi
}

# Function to check WhatsApp connection
check_whatsapp_status() {
    echo ""
    echo -e "${BLUE}🔍 Step 2: Checking WhatsApp connection status...${NC}"
    
    response=$(curl -s -X GET "$API_URL/api/status/client" \
        -H "X-API-Key: $API_KEY")
    
    echo "📊 Response: $response"
    
    # Check if ready
    if echo "$response" | grep -q '"ready":true'; then
        echo -e "${GREEN}✅ WhatsApp is connected and ready${NC}"
        return 0
    else
        echo -e "${RED}❌ WhatsApp is not ready${NC}"
        echo -e "${YELLOW}💡 Please scan QR code in the dashboard${NC}"
        return 1
    fi
}

# Function to send test message
send_message() {
    echo ""
    echo -e "${BLUE}📤 Step 3: Sending test message...${NC}"
    echo "   To: $TEST_PHONE"
    echo "   Message: $TEST_MESSAGE"
    
    response=$(curl -s -X POST "$API_URL/api/messages/send-text" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -d "{
            \"phone\": \"$TEST_PHONE\",
            \"message\": \"$TEST_MESSAGE\"
        }")
    
    echo ""
    echo "📊 Response:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    
    # Extract message ID
    MESSAGE_ID=$(echo "$response" | jq -r '.messageId // .data.messageId // empty' 2>/dev/null)
    
    if [ -n "$MESSAGE_ID" ]; then
        echo ""
        echo -e "${GREEN}✅ Message sent successfully${NC}"
        echo "   Message ID: $MESSAGE_ID"
        return 0
    else
        echo ""
        echo -e "${RED}❌ Failed to send message${NC}"
        return 1
    fi
}

# Function to monitor backend logs
monitor_backend_logs() {
    echo ""
    echo -e "${PURPLE}📡 Step 4: Monitoring backend logs for ACK events...${NC}"
    echo -e "${YELLOW}💡 Watching for ACK status changes (Press Ctrl+C to stop)${NC}"
    echo ""
    echo "Expected flow:"
    echo "   ⏳ 0 = Pending"
    echo "   ✓  1 = Sent"
    echo "   ✓✓ 2 = Delivered"
    echo "   ✓✓ 3 = Read (blue)"
    echo "   ▶️ 4 = Played"
    echo ""
    echo "----------------------------------------"
    
    # Monitor runtime logs
    if [ -f "runtime/logs/combined.log" ]; then
        tail -f runtime/logs/combined.log | grep --line-buffered "MESSAGE ACK" | while read line; do
            echo -e "${CYAN}$line${NC}"
        done
    else
        echo -e "${YELLOW}⚠️ Log file not found. Showing console output instead...${NC}"
        echo -e "${YELLOW}💡 Check the runtime server console for ACK events${NC}"
    fi
}

# Function to check message status via API
check_message_status() {
    echo ""
    echo -e "${BLUE}🔍 Step 5: Checking message status via API...${NC}"
    
    # Get recent messages
    response=$(curl -s -X GET "$API_URL/api/status/chats" \
        -H "X-API-Key: $API_KEY")
    
    echo "📊 Recent chats:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# Function to provide manual testing instructions
manual_test_instructions() {
    echo ""
    echo -e "${PURPLE}=========================================="
    echo -e "📱 Manual Testing Instructions"
    echo -e "==========================================${NC}"
    echo ""
    echo "1️⃣  Open Dashboard in browser:"
    echo "   http://localhost:3000/messages"
    echo ""
    echo "2️⃣  Open Browser Console (F12)"
    echo ""
    echo "3️⃣  Watch for these console logs:"
    echo ""
    echo -e "${GREEN}   Backend (Runtime Server):${NC}"
    echo "   🟢 ========== MESSAGE ACK RECEIVED =========="
    echo "   📨 Message ACK Details: { ackCode: 1, status: 'sent' }"
    echo "   ✅ Broadcast sent successfully"
    echo ""
    echo -e "${BLUE}   Frontend (Dashboard):${NC}"
    echo "   🟣 ========== WEBSOCKET MESSAGE ACK =========="
    echo "   📨 Message ACK received from backend"
    echo "   📡 Dispatching waqtor:message_ack event"
    echo "   ✅ Event dispatched successfully"
    echo ""
    echo "   🔴 ========== FRONTEND MESSAGE ACK =========="
    echo "   📨 [Messages] Message ACK received"
    echo "   📊 [Messages] ACK Code Mapping: { ackCode: 3, meaning: 'read' }"
    echo "   🔍 [Messages] Comparing phones"
    echo "   ✅ [Messages] MATCH FOUND! Updating status"
    echo "   📋 [Messages] Updated recipients"
    echo ""
    echo "4️⃣  Expected Status Changes in UI:"
    echo "   ⏳ Pending (gray)"
    echo "   ↓"
    echo "   ✓ Sent (gray)"
    echo "   ↓"
    echo "   ✓✓ Delivered (gray)"
    echo "   ↓"
    echo "   ✓✓ Read (BLUE) ← This confirms it works!"
    echo ""
    echo "5️⃣  To trigger 'Read' status:"
    echo "   - Open WhatsApp on your phone"
    echo "   - Find the test message"
    echo "   - Open and read it"
    echo "   - Watch the Dashboard update in real-time!"
    echo ""
}

# Function to test WebSocket connection
test_websocket() {
    echo ""
    echo -e "${BLUE}🔍 Step 6: Testing WebSocket connection...${NC}"
    
    # Check if wscat is installed
    if command -v wscat &> /dev/null; then
        echo "📡 Connecting to WebSocket..."
        echo "   ws://localhost:8080/ws?apiKey=$API_KEY"
        echo ""
        echo -e "${YELLOW}💡 You should see real-time events here${NC}"
        echo -e "${YELLOW}   Press Ctrl+C to stop${NC}"
        echo ""
        
        wscat -c "ws://localhost:8080/ws?apiKey=$API_KEY"
    else
        echo -e "${YELLOW}⚠️ wscat not installed${NC}"
        echo -e "${YELLOW}💡 Install it to test WebSocket:${NC}"
        echo "   npm install -g wscat"
        echo ""
        echo "Then run:"
        echo "   wscat -c \"ws://localhost:8080/ws?apiKey=$API_KEY\""
    fi
}

# Main test flow
main() {
    echo ""
    
    # Step 1: Check server
    if ! check_server; then
        exit 1
    fi
    
    # Step 2: Check WhatsApp status
    if ! check_whatsapp_status; then
        echo ""
        echo -e "${YELLOW}⚠️ Cannot proceed without WhatsApp connection${NC}"
        exit 1
    fi
    
    # Step 3: Send message
    if ! send_message; then
        echo ""
        echo -e "${RED}❌ Test failed: Could not send message${NC}"
        exit 1
    fi
    
    # Step 4: Show manual testing instructions
    manual_test_instructions
    
    # Ask user what to do next
    echo ""
    echo -e "${PURPLE}What would you like to do?${NC}"
    echo "1) Monitor backend logs for ACK events"
    echo "2) Check message status via API"
    echo "3) Test WebSocket connection"
    echo "4) Exit"
    echo ""
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            monitor_backend_logs
            ;;
        2)
            check_message_status
            ;;
        3)
            test_websocket
            ;;
        4)
            echo ""
            echo -e "${GREEN}✅ Test completed${NC}"
            echo ""
            echo -e "${YELLOW}📝 Summary:${NC}"
            echo "   - Message sent to: $TEST_PHONE"
            echo "   - Check Dashboard console for ACK updates"
            echo "   - Read the message on WhatsApp to see status change to 'Read'"
            echo ""
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
}

# Run main function
main
