#!/usr/bin/env bash

# Token Management Test Suite
# Tests the complete authentication flow with session tracking

BASE_URL="http://localhost:3000/api"
COOKIE_JAR="cookies.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓ SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[✗ ERROR]${NC} $1"
}

log_test() {
  echo -e "${YELLOW}[TEST]${NC} $1"
}

# Clean up
rm -f $COOKIE_JAR

# Test 1: Register user
log_test "Register new user"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "SecurePass123!"
  }')

if echo $REGISTER_RESPONSE | grep -q "success"; then
  log_success "User registration successful"
else
  log_error "User registration failed"
  echo $REGISTER_RESPONSE
  exit 1
fi

# Extract email for login
EMAIL=$(echo $REGISTER_RESPONSE | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
log_info "Created user: $EMAIL"

# Test 2: Login
log_test "Login with user credentials"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"SecurePass123!\"
  }")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ] && echo $RESPONSE_BODY | grep -q "accessToken"; then
  log_success "Login successful (HTTP $HTTP_CODE)"
  ACCESS_TOKEN=$(echo $RESPONSE_BODY | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  log_info "Access token: ${ACCESS_TOKEN:0:20}..."
else
  log_error "Login failed (HTTP $HTTP_CODE)"
  echo $RESPONSE_BODY
  exit 1
fi

# Test 3: Get active sessions
log_test "Retrieve active sessions"
SESSIONS_RESPONSE=$(curl -s -X GET $BASE_URL/users/me/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo $SESSIONS_RESPONSE | grep -q '"sessions"'; then
  log_success "Sessions retrieved"
  SESSION_COUNT=$(echo $SESSIONS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
  log_info "Active sessions: $SESSION_COUNT"
else
  log_error "Failed to retrieve sessions"
  echo $SESSIONS_RESPONSE
fi

# Test 4: Refresh token
log_test "Refresh access token"
REFRESH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR)

HTTP_CODE=$(echo "$REFRESH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$REFRESH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ] && echo $RESPONSE_BODY | grep -q "accessToken"; then
  log_success "Token refresh successful (HTTP $HTTP_CODE)"
  NEW_ACCESS_TOKEN=$(echo $RESPONSE_BODY | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  log_info "New access token: ${NEW_ACCESS_TOKEN:0:20}..."
else
  log_error "Token refresh failed (HTTP $HTTP_CODE)"
  echo $RESPONSE_BODY
fi

# Test 5: Verify sessions count after refresh
log_test "Verify session count after refresh"
SESSIONS_RESPONSE=$(curl -s -X GET $BASE_URL/users/me/sessions \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

NEW_SESSION_COUNT=$(echo $SESSIONS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
log_info "Session count after refresh: $NEW_SESSION_COUNT"

# Test 6: Logout
log_test "Logout from current session"
LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/auth/logout \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR)

HTTP_CODE=$(echo "$LOGOUT_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
  log_success "Logout successful (HTTP $HTTP_CODE)"
else
  log_error "Logout failed (HTTP $HTTP_CODE)"
  echo "$LOGOUT_RESPONSE"
fi

# Test 7: Verify sessions after logout
log_test "Verify sessions after logout"
SESSIONS_RESPONSE=$(curl -s -X GET $BASE_URL/users/me/sessions \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

FINAL_SESSION_COUNT=$(echo $SESSIONS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
log_info "Final session count: $FINAL_SESSION_COUNT"

if [ "$FINAL_SESSION_COUNT" -lt "$NEW_SESSION_COUNT" ]; then
  log_success "Session successfully removed after logout"
else
  log_error "Session count did not decrease after logout"
fi

# Cleanup
rm -f $COOKIE_JAR

log_success "All tests completed!"
