#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URLs
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ $2${NC}"
    ((TESTS_FAILED++))
  fi
}

echo -e "${BLUE}=== E2E BACKEND TO FRONTEND FLOW TEST ===${NC}\n"

# ==================== TEST 1: Server Health ====================
echo -e "${YELLOW}[TEST 1] Server Health Check${NC}"
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/)
if [ "$BACKEND_HEALTH" -eq 200 ]; then
  test_result 0 "Backend Server is running (HTTP $BACKEND_HEALTH)"
else
  test_result 1 "Backend Server health check failed (HTTP $BACKEND_HEALTH)"
  exit 1
fi

# ==================== TEST 2: User Registration ====================
echo -e "\n${YELLOW}[TEST 2] User Registration${NC}"
UNIQUE_EMAIL="john-$(date +%s)@test.com"
USER_SIGNUP=$(curl -s -X POST $BACKEND_URL/users/register \
  -H "Content-Type: application/json" \
  -d "{
    \"fullname\": {\"firstname\": \"John\", \"lastname\": \"Doe\"},
    \"email\": \"$UNIQUE_EMAIL\",
    \"password\": \"password123\"
  }")

USER_TOKEN=$(echo $USER_SIGNUP | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $USER_SIGNUP | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$USER_TOKEN" ]; then
  test_result 0 "User registration successful"
  echo "  User ID: $USER_ID"
  echo "  Token: ${USER_TOKEN:0:20}..."
else
  test_result 1 "User registration failed"
  echo "  Response: $USER_SIGNUP"
fi

# ==================== TEST 3: User Login ====================
echo -e "\n${YELLOW}[TEST 3] User Login${NC}"
USER_LOGIN=$(curl -s -X POST $BACKEND_URL/users/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$UNIQUE_EMAIL\",
    \"password\": \"password123\"
  }")

USER_TOKEN_LOGIN=$(echo $USER_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$USER_TOKEN_LOGIN" ]; then
  test_result 0 "User login successful"
  USER_TOKEN=$USER_TOKEN_LOGIN
else
  test_result 1 "User login failed"
  echo "  Response: $USER_LOGIN"
fi

# ==================== TEST 4: Location Suggestions ====================
echo -e "\n${YELLOW}[TEST 4] Location Suggestions (Maps API)${NC}"
LOCATION_SUGGEST=$(curl -s -X GET "$BACKEND_URL/maps/get-suggestions?input=new%20york" \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$LOCATION_SUGGEST" | grep -q '"success":true'; then
  test_result 0 "Location suggestions retrieved (Maps API working)"
else
  test_result 1 "Location suggestions failed"
  echo "  Response: $(echo $LOCATION_SUGGEST | cut -c1-100)..."
fi

# ==================== TEST 5: Get Fare ====================
echo -e "\n${YELLOW}[TEST 5] Calculate Ride Fare${NC}"
FARE_RESPONSE=$(curl -s -X GET "$BACKEND_URL/rides/get-fare?pickup=times%20square&destination=central%20park" \
  -H "Authorization: Bearer $USER_TOKEN")

FARE_AUTO=$(echo $FARE_RESPONSE | grep -o '"auto":[0-9]*' | cut -d':' -f2)
FARE_CAR=$(echo $FARE_RESPONSE | grep -o '"car":[0-9]*' | cut -d':' -f2)
FARE_MOTO=$(echo $FARE_RESPONSE | grep -o '"moto":[0-9]*' | cut -d':' -f2)

if [ ! -z "$FARE_CAR" ] && [ ! -z "$FARE_AUTO" ] && [ ! -z "$FARE_MOTO" ]; then
  test_result 0 "Fare calculation successful"
  echo "  Car: ₹$FARE_CAR | Auto: ₹$FARE_AUTO | Moto: ₹$FARE_MOTO"
else
  test_result 1 "Fare calculation failed"
  echo "  Response: $FARE_RESPONSE"
fi

# ==================== TEST 6: Create Ride ====================
echo -e "\n${YELLOW}[TEST 6] Create Ride Request${NC}"
CREATE_RIDE=$(curl -s -X POST $BACKEND_URL/rides/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "pickup": "times square",
    "destination": "central park",
    "vehicleType": "car"
  }')

RIDE_ID=$(echo $CREATE_RIDE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
RIDE_STATUS=$(echo $CREATE_RIDE | grep -o '"status":"[^"]*' | cut -d'"' -f4)
RIDE_FARE=$(echo $CREATE_RIDE | grep -o '"fare":[0-9]*' | cut -d':' -f2)
RIDE_OTP=$(echo $CREATE_RIDE | grep -o '"otp":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$RIDE_ID" ]; then
  test_result 0 "Ride created successfully"
  echo "  Ride ID: $RIDE_ID"
  echo "  Status: $RIDE_STATUS"
  echo "  Fare: ₹$RIDE_FARE"
  echo "  OTP: $RIDE_OTP"
else
  test_result 1 "Ride creation failed"
  echo "  Response: $CREATE_RIDE"
fi

# ==================== TEST 7: Captain Registration ====================
echo -e "\n${YELLOW}[TEST 7] Captain Registration${NC}"
UNIQUE_CAPTAIN_EMAIL="jane-$(date +%s)@captain.com"
CAPTAIN_SIGNUP=$(curl -s -X POST $BACKEND_URL/captains/register \
  -H "Content-Type: application/json" \
  -d "{
    \"fullname\": {\"firstname\": \"Jane\", \"lastname\": \"Smith\"},
    \"email\": \"$UNIQUE_CAPTAIN_EMAIL\",
    \"password\": \"password123\",
    \"vehicle\": {
      \"color\": \"Black\",
      \"plate\": \"DL01AB$(date +%s | tail -c 5)\",
      \"capacity\": 4,
      \"vehicleType\": \"car\"
    }
  }")

CAPTAIN_TOKEN=$(echo $CAPTAIN_SIGNUP | grep -o '"token":"[^"]*' | cut -d'"' -f4)
CAPTAIN_ID=$(echo $CAPTAIN_SIGNUP | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$CAPTAIN_TOKEN" ]; then
  test_result 0 "Captain registration successful"
  echo "  Captain ID: $CAPTAIN_ID"
else
  test_result 1 "Captain registration failed"
  echo "  Response: $CAPTAIN_SIGNUP"
fi

# ==================== TEST 8: Captain Login ====================
echo -e "\n${YELLOW}[TEST 8] Captain Login${NC}"
CAPTAIN_LOGIN=$(curl -s -X POST $BACKEND_URL/captains/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$UNIQUE_CAPTAIN_EMAIL\",
    \"password\": \"password123\"
  }")

CAPTAIN_TOKEN_LOGIN=$(echo $CAPTAIN_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$CAPTAIN_TOKEN_LOGIN" ]; then
  test_result 0 "Captain login successful"
  CAPTAIN_TOKEN=$CAPTAIN_TOKEN_LOGIN
else
  test_result 1 "Captain login failed"
  echo "  Response: $CAPTAIN_LOGIN"
fi

# ==================== TEST 9: Confirm Ride ====================
echo -e "\n${YELLOW}[TEST 9] Confirm Ride (Captain Accepts)${NC}"
CONFIRM_JSON=$(cat <<EOF
{"rideId": "$RIDE_ID"}
EOF
)
CONFIRM_RIDE=$(curl -s -X POST $BACKEND_URL/rides/confirm-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CAPTAIN_TOKEN" \
  -d "$CONFIRM_JSON")

CONFIRM_STATUS=$(echo $CONFIRM_RIDE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$CONFIRM_STATUS" = "accepted" ]; then
  test_result 0 "Ride confirmed by captain"
  echo "  Ride Status: $CONFIRM_STATUS"
else
  test_result 1 "Ride confirmation failed"
  echo "  Response: $CONFIRM_RIDE"
fi

# ==================== TEST 10: Start Ride ====================
echo -e "\n${YELLOW}[TEST 10] Start Ride (OTP Verification)${NC}"
START_JSON=$(cat <<EOF
{"rideId": "$RIDE_ID", "otp": "$RIDE_OTP"}
EOF
)
START_RIDE=$(curl -s -X POST $BACKEND_URL/rides/start-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "$START_JSON")

START_STATUS=$(echo $START_RIDE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$START_STATUS" = "ongoing" ]; then
  test_result 0 "Ride started (OTP verified)"
  echo "  Ride Status: $START_STATUS"
else
  test_result 1 "Ride start failed (OTP verification)"
  echo "  Response: $START_RIDE"
fi

# ==================== TEST 11: End Ride ====================
echo -e "\n${YELLOW}[TEST 11] End Ride (Complete Journey)${NC}"
END_JSON=$(cat <<EOF
{"rideId": "$RIDE_ID"}
EOF
)
END_RIDE=$(curl -s -X POST $BACKEND_URL/rides/end-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CAPTAIN_TOKEN" \
  -d "$END_JSON")

END_STATUS=$(echo $END_RIDE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$END_STATUS" = "completed" ]; then
  test_result 0 "Ride completed successfully"
  echo "  Ride Status: $END_STATUS"
else
  test_result 1 "Ride completion failed"
  echo "  Response: $END_RIDE"
fi

# ==================== TEST 12: Frontend Index ====================
echo -e "\n${YELLOW}[TEST 12] Frontend Server Health${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/)
if [ "$FRONTEND_STATUS" -eq 200 ]; then
  test_result 0 "Frontend Server is running (HTTP $FRONTEND_STATUS)"
else
  test_result 1 "Frontend Server check failed (HTTP $FRONTEND_STATUS)"
fi

# ==================== TEST 13: User Profile (Protected Route) ====================
echo -e "\n${YELLOW}[TEST 13] Get User Profile (Protected Route)${NC}"
USER_PROFILE=$(curl -s -X GET $BACKEND_URL/users/profile \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$USER_PROFILE" | grep -q "$UNIQUE_EMAIL"; then
  test_result 0 "User profile retrieved (Protected route working)"
  echo "  Email: $UNIQUE_EMAIL"
else
  test_result 1 "User profile retrieval failed"
  echo "  Response: $(echo $USER_PROFILE | cut -c1-100)..."
fi

# ==================== SUMMARY ====================
echo -e "\n${BLUE}=== TEST SUMMARY ===${NC}"
echo -e "${GREEN}✓ Passed: $TESTS_PASSED${NC}"
echo -e "${RED}✗ Failed: $TESTS_FAILED${NC}"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))

echo -e "\n${BLUE}Overall: ${PERCENTAGE}% ($TESTS_PASSED/$TOTAL tests passed)${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}🎉 All tests passed! Backend to Frontend flow is working correctly!${NC}"
  exit 0
else
  echo -e "\n${RED}⚠️  Some tests failed. Check the output above for details.${NC}"
  exit 1
fi
