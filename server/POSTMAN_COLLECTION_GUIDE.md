# Postman Collection Guide - Complete API Testing

## Overview
This guide provides all possible combinations for testing the AI Facility Management API using Postman, including role-based authorization scenarios.

## Base URL
```
http://localhost:3000
```

## Collection Structure

### 1. Authentication Endpoints

#### 1.1 User Registration (Signup)

**Endpoint:** `POST {{baseURL}}/api/v1/users/signup`

**Headers:**
```
Content-Type: application/json
```

**Test Cases:**

##### A. Create Normal User
```json
{
    "name": "Normal",
    "surname": "User",
    "email": "normal@test.com",
    "password": "password123"
}
```

##### B. Create Normal User (Explicit Role)
```json
{
    "name": "Normal",
    "surname": "User",
    "email": "normal2@test.com",
    "password": "password123",
    "role": "normal"
}
```

##### C. Create Admin User
```json
{
    "name": "Admin",
    "surname": "User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
}
```

##### D. Invalid Role (Should Fail)
```json
{
    "name": "Invalid",
    "surname": "User",
    "email": "invalid@test.com",
    "password": "password123",
    "role": "superuser"
}
```

##### E. Missing Required Fields (Should Fail)
```json
{
    "email": "incomplete@test.com",
    "password": "password123"
}
```

#### 1.2 User Login

**Endpoint:** `POST {{baseURL}}/api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Test Cases:**

##### A. Normal User Login
```json
{
    "email": "normal@test.com",
    "password": "password123"
}
```

##### B. Admin User Login
```json
{
    "email": "admin@test.com",
    "password": "admin123"
}
```

##### C. Invalid Credentials (Should Fail)
```json
{
    "email": "admin@test.com",
    "password": "wrongpassword"
}
```

##### D. Non-existent User (Should Fail)
```json
{
    "email": "nonexistent@test.com",
    "password": "password123"
}
```

### 2. Room Feature Endpoints

#### 2.1 Create Room Feature (Admin Only)

**Endpoint:** `POST {{baseURL}}/api/v1/room-features`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Creates Classroom
```json
{
    "roomNumber": "L.1.01",
    "floor": 1,
    "roomType": "classroom",
    "capacity": 30,
    "areaSqm": 45.5,
    "windowCount": 3,
    "hasNaturalLight": true,
    "hasProjector": true,
    "hasMicrophone": true,
    "hasCamera": false,
    "hasAirConditioner": true,
    "hasNoiseCancelling": false
}
```

##### B. Admin Creates Study Room
```json
{
    "roomNumber": "S.2.05",
    "floor": 2,
    "roomType": "study_room",
    "capacity": 8,
    "areaSqm": 20.0,
    "windowCount": 2,
    "hasNaturalLight": true,
    "hasProjector": false,
    "hasMicrophone": false,
    "hasCamera": false,
    "hasAirConditioner": true,
    "hasNoiseCancelling": true
}
```

##### C. Admin Creates Lab
```json
{
    "roomNumber": "LAB.3.02",
    "floor": 3,
    "roomType": "lab",
    "capacity": 15,
    "areaSqm": 60.0,
    "windowCount": 4,
    "hasNaturalLight": true,
    "hasProjector": true,
    "hasMicrophone": true,
    "hasCamera": true,
    "hasAirConditioner": true,
    "hasNoiseCancelling": false
}
```

##### D. Admin Creates Office
```json
{
    "roomNumber": "OFF.1.12",
    "floor": 1,
    "roomType": "office",
    "capacity": 4,
    "areaSqm": 25.0,
    "windowCount": 1,
    "hasNaturalLight": true,
    "hasProjector": false,
    "hasMicrophone": false,
    "hasCamera": false,
    "hasAirConditioner": true,
    "hasNoiseCancelling": true
}
```

##### E. Admin Creates Meeting Room
```json
{
    "roomNumber": "MEET.2.08",
    "floor": 2,
    "roomType": "meeting_room",
    "capacity": 12,
    "areaSqm": 35.0,
    "windowCount": 2,
    "hasNaturalLight": true,
    "hasProjector": true,
    "hasMicrophone": true,
    "hasCamera": true,
    "hasAirConditioner": true,
    "hasNoiseCancelling": true
}
```

##### F. Normal User Attempts Create (Should Fail)
```json
{
    "roomNumber": "BLOCKED.1.01",
    "floor": 1,
    "roomType": "classroom",
    "capacity": 20,
    "areaSqm": 30.0,
    "windowCount": 2,
    "hasNaturalLight": true,
    "hasProjector": false,
    "hasMicrophone": false,
    "hasCamera": false,
    "hasAirConditioner": false,
    "hasNoiseCancelling": false
}
```

##### G. Invalid Room Type (Should Fail)
```json
{
    "roomNumber": "INV.1.01",
    "floor": 1,
    "roomType": "invalid_type",
    "capacity": 20,
    "areaSqm": 30.0,
    "windowCount": 2,
    "hasNaturalLight": true,
    "hasProjector": false,
    "hasMicrophone": false,
    "hasCamera": false,
    "hasAirConditioner": false,
    "hasNoiseCancelling": false
}
```

##### H. Missing Required Fields (Should Fail)
```json
{
    "roomNumber": "INCOMPLETE.1.01",
    "floor": 1
}
```

##### I. Invalid Field Types (Should Fail)
```json
{
    "roomNumber": "INVALID.1.01",
    "floor": "first",
    "roomType": "classroom",
    "capacity": "twenty",
    "areaSqm": "large",
    "windowCount": "many",
    "hasNaturalLight": "yes",
    "hasProjector": "no",
    "hasMicrophone": 1,
    "hasCamera": 0,
    "hasAirConditioner": "true",
    "hasNoiseCancelling": "false"
}
```

#### 2.2 Get All Room Features

**Endpoint:** `GET {{baseURL}}/api/v1/room-features/all`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Views All Rooms
- Use admin token
- Should return all room features

##### B. Normal User Views All Rooms
- Use normal user token
- Should return all room features (same as admin)

##### C. No Authentication (Should Fail)
- Remove Authorization header
- Should return authentication error

#### 2.3 Get Room Feature by ID

**Endpoint:** `GET {{baseURL}}/api/v1/room-features/{{roomId}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Views Specific Room
- Use admin token
- Use existing room ID
- Should return room details

##### B. Normal User Views Specific Room
- Use normal user token
- Use existing room ID
- Should return room details

##### C. Non-existent Room ID (Should Fail)
- Use valid token
- Use non-existent ID (e.g., 99999)
- Should return not found error

##### D. Invalid Room ID Format (Should Fail)
- Use valid token
- Use invalid ID (e.g., "abc")
- Should return validation error

#### 2.4 Update Room Feature (Admin Only)

**Endpoint:** `PUT {{baseURL}}/api/v1/room-features/{{roomId}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Updates Full Room
```json
{
    "roomNumber": "UPDATED.1.01",
    "floor": 2,
    "roomType": "meeting_room",
    "capacity": 15,
    "areaSqm": 40.0,
    "windowCount": 3,
    "hasNaturalLight": true,
    "hasProjector": true,
    "hasMicrophone": true,
    "hasCamera": true,
    "hasAirConditioner": true,
    "hasNoiseCancelling": true
}
```

##### B. Admin Partial Update
```json
{
    "capacity": 25,
    "hasProjector": false,
    "hasCamera": true
}
```

##### C. Admin Updates Room Type Only
```json
{
    "roomType": "lab"
}
```

##### D. Normal User Attempts Update (Should Fail)
```json
{
    "capacity": 50
}
```

##### E. Invalid Room Type in Update (Should Fail)
```json
{
    "roomType": "gymnasium"
}
```

##### F. Invalid Field Types in Update (Should Fail)
```json
{
    "capacity": "unlimited",
    "hasProjector": "maybe"
}
```

#### 2.5 Delete Room Feature (Admin Only)

**Endpoint:** `DELETE {{baseURL}}/api/v1/room-features/{{roomId}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Deletes Room
- Use admin token
- Use existing room ID
- Should successfully delete

##### B. Normal User Attempts Delete (Should Fail)
- Use normal user token
- Use existing room ID
- Should return access denied

##### C. Admin Deletes Non-existent Room (Should Fail)
- Use admin token
- Use non-existent room ID
- Should return not found error

#### 2.6 Get User's Room Features

**Endpoint:** `GET {{baseURL}}/api/v1/room-features/my-room-features`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Test Cases:**

##### A. Admin Views Own Rooms
- Use admin token
- Should return rooms created by admin

##### B. Normal User Views Own Rooms
- Use normal user token
- Should return rooms created by normal user (if any)

## Postman Environment Variables

Set up these variables in your Postman environment:

```json
{
    "baseURL": "http://localhost:3000",
    "normalToken": "",
    "adminToken": "",
    "roomId": ""
}
```

## Postman Pre-request Scripts

### Auto-login Script for Admin
Add this to collection or folder level:

```javascript
// Auto-login as admin if token is expired or missing
if (!pm.environment.get("adminToken")) {
    pm.sendRequest({
        url: pm.environment.get("baseURL") + "/api/v1/auth/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "email": "admin@test.com",
                "password": "admin123"
            })
        }
    }, function (err, response) {
        if (response && response.json() && response.json().data) {
            pm.environment.set("adminToken", response.json().data.token);
        }
    });
}
```

### Auto-login Script for Normal User
```javascript
// Auto-login as normal user if token is expired or missing
if (!pm.environment.get("normalToken")) {
    pm.sendRequest({
        url: pm.environment.get("baseURL") + "/api/v1/auth/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "email": "normal@test.com",
                "password": "password123"
            })
        }
    }, function (err, response) {
        if (response && response.json() && response.json().data) {
            pm.environment.set("normalToken", response.json().data.token);
        }
    });
}
```

## Test Scenarios

### Scenario 1: Complete Admin Workflow
1. Create admin user
2. Login as admin
3. Create multiple room features
4. View all rooms
5. Update a room
6. Delete a room

### Scenario 2: Normal User Limitations
1. Create normal user
2. Login as normal user
3. Try to create room (should fail)
4. View all rooms (should succeed)
5. Try to update room (should fail)
6. Try to delete room (should fail)

### Scenario 3: Mixed Authorization Testing
1. Login as admin, create rooms
2. Login as normal user, view rooms
3. Switch back to admin, modify rooms
4. Verify normal user can see changes but not modify

### Scenario 4: Error Handling
1. Test all invalid inputs
2. Test authentication failures
3. Test authorization failures
4. Test validation errors

## Expected Response Codes

| Scenario | Expected Code | Description |
|----------|---------------|-------------|
| Successful operation | 200/201 | Success |
| Validation error | 400 | Bad request |
| Authentication error | 401 | Unauthorized |
| Authorization error | 403 | Forbidden |
| Resource not found | 404 | Not found |
| Duplicate resource | 409 | Conflict |
| Server error | 500 | Internal error |

## Postman Tests Scripts

### Generic Success Test
```javascript
pm.test("Status code is successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status || jsonData.success).to.be.true;
});
```

### Authorization Failure Test
```javascript
pm.test("Access denied for normal user", function () {
    pm.response.to.have.status(403);
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Access denied");
});
```

### Room Creation Test
```javascript
pm.test("Room created successfully", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.environment.set("roomId", jsonData.data.id);
});
```

This comprehensive guide covers all possible combinations for testing the API with Postman, including success scenarios, error cases, and role-based authorization testing.
