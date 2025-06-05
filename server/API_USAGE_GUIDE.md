# API Usage Guide

## Authentication Required

All room feature endpoints require authentication. You need to:

1. **Create an account** or **Login** to get a JWT token
2. **Include the token** in the Authorization header for all room feature requests

### Step 1: Create Account (if you don't have one)

**Endpoint:** `POST /api/v1/users/signup`

**Request Body:**
```json
{
    "name": "Your Name",
    "surname": "Your Surname", 
    "email": "your@email.com",
    "password": "yourpassword123"
}
```

### Step 2: Login to Get Token

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
    "email": "your@email.com",
    "password": "yourpassword123"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Step 3: Use Token for Room Operations

**Include in headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## Room Feature Endpoints

### Create Room

**Endpoint:** `POST /api/v1/room-features`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`
- `Content-Type: application/json`

**Request Body (use camelCase, not snake_case):**
```json
{
    "roomNumber": "L.3.07",
    "floor": 0,
    "roomType": "classroom",
    "capacity": 5,
    "areaSqm": 10.0,
    "windowCount": 0,
    "hasNaturalLight": true,
    "hasProjector": true,
    "hasMicrophone": false,
    "hasCamera": false,
    "hasAirConditioner": true,
    "hasNoiseCancelling": false
}
```

**Valid Room Types:**
- `classroom`
- `study_room`
- `lab`
- `office`
- `meeting_room`

### Get All Rooms

**Endpoint:** `GET /api/v1/room-features/all`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`

### Get Room by ID

**Endpoint:** `GET /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`

### Update Room

**Endpoint:** `PUT /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`
- `Content-Type: application/json`

**Request Body:** (same format as create, but all fields optional)

### Delete Room

**Endpoint:** `DELETE /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`

## Common Issues

### 1. Field Name Mismatch Error
**Problem:** You're getting validation errors for all fields
**Solution:** Use camelCase field names, not snake_case:
- ❌ `room_number` → ✅ `roomNumber`
- ❌ `room_type` → ✅ `roomType`
- ❌ `area_sqm` → ✅ `areaSqm`
- ❌ `window_count` → ✅ `windowCount`
- ❌ `has_natural_light` → ✅ `hasNaturalLight`
- etc.

### 2. Authentication Error
**Problem:** "Token could not be found" or "Cannot POST /api/room-features"
**Solution:** 
- Make sure you're using the correct endpoint: `/api/v1/room-features`
- Include `Authorization: Bearer <token>` header
- Token expires in 30 minutes, get a new one if needed

### 3. Room Type Validation Error
**Problem:** "Room type must be one of: classroom, study_room, lab, office, meeting_room"
**Solution:** Use exactly one of the valid room types listed above

## Postman Usage

1. **Create a new request**
2. **Set method to POST** and URL to `http://localhost:3000/api/v1/room-features`
3. **Add headers:**
   - `Authorization`: `Bearer <your-jwt-token>`
   - `Content-Type`: `application/json`
4. **In Body tab, select "raw" and paste your JSON with camelCase field names**
5. **Send the request**

## Working Example (Copy-Paste Ready)

```json
{
    "roomNumber": "L.3.08",
    "floor": 1,
    "roomType": "study_room",
    "capacity": 8,
    "areaSqm": 25.5,
    "windowCount": 2,
    "hasNaturalLight": true,
    "hasProjector": false,
    "hasMicrophone": true,
    "hasCamera": true,
    "hasAirConditioner": false,
    "hasNoiseCancelling": true
}
```
