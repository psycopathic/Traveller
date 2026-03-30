#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

TESTS_PASSED=0
TESTS_FAILED=0

test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ $2${NC}"
    ((TESTS_FAILED++))
  fi
}

echo -e "${BLUE}=== E2E BACKEND TO FRONTEND FLOW TEST (V2 - Using jq) ===${NC}\n"

# TEST 1: Server Health
echo -e "${YELLOW}[TEST 1] Server Health Check${NC}"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/)
if [ "$BACKEND_STATUS" -eq 200 ]; then
  test_result 0 "Backend Server is running"
else
  test_result 1 "Backend Server health check failed"
  exit 1
fi

# TEST 2: User Registration
echo -e "\n${YELLOW}[TEST 2] User Registration${NC}"
UNIQUE_EMAIL="user-$(date +%s)@test.com"
USER_RESPONSE=$(curl -s -X POST $BACKEND_URL/users/register \
  -H "Content-Type: application/json" \
  -d "{
    \"fullname\": {\"firstname\": \"John\", \"lastname\": \"Doe\"},
    \"email\": \"$UNIQUE_EMAIL\",
    \"password\": \"password123\"
  }")

USER_TOKEN=$(echo "$USER_RESPONSE" | jq -r '.data.token // empty')
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.data._id // empty')

if [ ! -z "$USER_TOKEN" ] && [ "$USER_TOKEN" != "null" ]; then
  test_result 0 "User registration successful (ID: ${USER_ID:0:8}...)"
else
  test_result 1 "User registration failed"
  echo "  Response: $(echo $USER_RESPONSE | jq -c .)"
fi

# TEST 3: User Login
echo -e "\n${YELLOW}[TEST 3] User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BACKEND_URL/users/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$UNIQUE_EMAIL\",
    \"password\": \"password123\"
  }")

USER_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
if [ ! -z "$USER_TOKEN" ] && [ "$USER_TOKEN" != "null" ]; then
  test_result 0 "User login successful"
else
  test_result 1 "User login failed"
  echo "  Response: $(echo $LOGIN_RESPONSE | jq -c .)"
fi

# TEST 4: Location Suggestions
echo -e "\n${YELLOW}[TEST 4] Location Suggestions (Maps API)${NC}"
LOCATION_RESPONSE=$(curl -s -X GET "$BACKEND_URL/maps/get-suggestions?input=new%20york" \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$LOCATION_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  test_result 0 "Location suggestions retrieved"
else
  test_result 1 "Location suggestions failed"
  echo "  Response: $(echo $LOCATION_RESPONSE | jq -c .)"
fi

# TEST 5: Calculate Ride Fare
echo -e "\n${YELLOW}[TEST 5] Calculate Ride Fare${NC}"
FARE_RESPONSE=$(curl -s -X GET "$BACKEND_URL/rides/get-fare?pickup=times%20square&destination=central%20park" \
  -H "Authorization: Bearer $USER_TOKEN")

FARE_CAR=$(echo "$FARE_RESPONSE" | jq '.data.car // empty')
if [ ! -z "$FARE_CAR" ] && [ "$FARE_CAR" != "null" ]; then
  FARE_AUTO=$(echo "$FARE_RESPONSE" | jq '.data.auto')
  FARE_MOTO=$(echo "$FARE_RESPONSE" | jq '.data.moto')
  test_result 0 "Fare calculation successful (Car: ₹$FARE_CAR, Auto: ₹$FARE_AUTO, Moto: ₹$FARE_MOTO)"
else
  test_result 1 "Fare calculation failed"
  echo "  Response: $(echo $FARE_RESPONSE | jq -c .)"
fi

# TEST 6: Create Ride
echo -e "\n${YELLOW}[TEST 6] Create Ride Request${NC}"
RIDE_RESPONSE=$(curl -s -X POST $BACKEND_URL/rides/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "pickup": "times square",
    "destination": "central park",
    "vehicleType": "car"
  }')

RIDE_ID=$(echo "$RIDE_RESPONSE" | jq -r '.data._id // empty')
RIDE_OTP=$(echo "$RIDE_RESPONSE" | jq -r '.data.otp // empty')
RIDE_STATUS=$(echo "$RIDE_RESPONSE" | jq -r '.data.status // empty')
RIDE_FARE=$(echo "$RIDE_RESPONSE" | jq '.data.fare // empty')

if [ ! -z "$RIDE_ID" ] && [ "$RIDE_ID" != "null" ]; then
  test_result 0 "Ride created successfully (ID: ${RIDE_ID:0:8}..., OTP: $RIDE_OTP, Status: $RIDE_STATUS)"
else
  test_result 1 "Ride creation failed"
  echo "  Response: $(echo $RIDE_RESPONSE | jq -c .)"
fi

# TEST 7: Captain Registration
echo -e "\n${YELLOW}[TEST 7] Captain Registration${NC}"
CAPTAIN_EMAIL="captain-$(date +%s)@test.com"
CAPTAIN_RESPONSE=$(curl -s -X POST $BACKEND_URL/captains/register \
  -H "Content-Type: application/json" \
  -d "{
    \"fullname\": {\"firstname\": \"Jane\", \"lastname\": \"Smith\"},
    \"email\": \"$CAPTAIN_EMAIL\",
    \"password\": \"password123\",
    \"vehicle\": {
      \"color\": \"Black\",
      \"plate\": \"DL01AB$(date +%s | tail -c 5)\",
      \"capacity\": 4,
      \"vehicleType\": \"car\"
    }
  }")

CAPTAIN_TOKEN=$(echo "$CAPTAIN_RESPONSE" | jq -r '.data.token // empty')
CAPTAIN_ID=$(echo "$CAPTAIN_RESPONSE" | jq -r '.data.captain._id // empty')

if [ ! -z "$CAPTAIN_TOKEN" ] && [ "$CAPTAIN_TOKEN" != "null" ]; then
  test_result 0 "Captain registration successful (ID: ${CAPTAIN_ID:0:8}...)"
else
  test_result 1 "Captain registration failed"
  echo "  Response: $(echo $CAPTAIN_RESPONSE | jq -c .)"
fi

# TEST 8: Captain Login
echo -e "\n${YELLOW}[TEST 8] Captain Login${NC}"
CAPTAIN_LOGIN=$(curl -s -X POST $BACKEND_URL/captains/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$CAPTAIN_EMAIL\",
    \"password\": \"password123\"
  }")

CAPTAIN_TOKEN=$(echo "$CAPTAIN_LOGIN" | jq -r '.data.token // empty')
if [ ! -z "$CAPTAIN_TOKEN" ] && [ "$CAPTAIN_TOKEN" != "null" ]; then
  test_result 0 "Captain login successful"
else
  test_result 1 "Captain login failed"
  echo "  Response: $(echo $CAPTAIN_LOGIN | jq -c .)"
fi

# TEST 9: Confirm Ride
echo -e "\n${YELLOW}[TEST 9] Confirm Ride (Captain Accepts)${NC}"
CONFIRM_RESPONSE=$(curl -s -X POST $BACKEND_URL/rides/confirm-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CAPTAIN_TOKEN" \
  -d "{\"rideId\": \"$RIDE_ID\"}")

CONFIRM_STATUS=$(echo "$CONFIRM_RESPONSE" | jq -r '.data.status // empty')
if [ "$CONFIRM_STATUS" = "accepted" ]; then
  test_result 0 "Ride confirmed by captain (Status: $CONFIRM_STATUS)"
else
  test_result 1 "Ride confirmation failed"
  echo "  Response: $(echo $CONFIRM_RESPONSE | jq -c .)"
fi

# TEST 10: Start Ride
echo -e "\n${YELLOW}[TEST 10] Start Ride (OTP Verification)${NC}"
START_RESPONSE=$(curl -s -X POST $BACKEND_URL/rides/start-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"rideId\": \"$RIDE_ID\", \"otp\": \"$RIDE_OTP\"}")

START_STATUS=$(echo "$START_RESPONSE" | jq -r '.data.status // empty')
if [ "$START_STATUS" = "ongoing" ]; then
  test_result 0 "Ride started (OTP verified, Status: $START_STATUS)"
else
  test_result 1 "Ride start failed"
  echo "  Response: $(echo $START_RESPONSE | jq -c .)"
fi

# TEST 11: End Ride
echo -e "\n${YELLOW}[TEST 11] End Ride (Complete Journey)${NC}"
END_RESPONSE=$(curl -s -X POST $BACKEND_URL/rides/end-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CAPTAIN_TOKEN" \
  -d "{\"rideId\": \"$RIDE_ID\"}")

END_STATUS=$(echo "$END_RESPONSE" | jq -r '.data.status // empty')
if [ "$END_STATUS" = "completed" ]; then
  test_result 0 "Ride completed successfully (Status: $END_STATUS)"
else
  test_result 1 "Ride completion failed"
  echo "  Response: $(echo $END_RESPONSE | jq -c .)"
fi

# TEST 12: Frontend Server
echo -e "\n${YELLOW}[TEST 12] Frontend Server Health${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/)
if [ "$FRONTEND_STATUS" -eq 200 ]; then
  test_result 0 "Frontend Server is running"
else
  test_result 1 "Frontend Server check failed"
fi

# TEST 13: Get User Profile (Protected Route)
echo -e "\n${YELLOW}[TEST 13] Get User Profile (Protected Route)${NC}"
PROFILE_RESPONSE=$(curl -s -X GET $BACKEND_URL/users/profile \
  -H "Authorization: Bearer $USER_TOKEN")

PROFILE_EMAIL=$(echo "$PROFILE_RESPONSE" | jq -r '.data.email // empty')
if [ "$PROFILE_EMAIL" = "$UNIQUE_EMAIL" ]; then
  test_result 0 "User profile retrieved (Protected route working)"
else
  test_result 1 "User profile retrieval failed"
  echo "  Response: $(echo $PROFILE_RESPONSE | jq -c .)"
fi

# Summary
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
