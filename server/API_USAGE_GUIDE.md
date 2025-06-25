# API Usage Guide

## Authentication and Authorization Required

All room feature endpoints require authentication. Some endpoints also require admin privileges. You need to:

1. **Create an account** or **Login** to get a JWT token
2. **Include the token** in the Authorization header for all room feature requests
3. **Have admin role** for creating, updating, or deleting room features

## User Roles

There are two user roles in the system:
- **Normal User** (`normal`): Can view room features but cannot create, update, or delete them
- **Admin User** (`admin`): Can perform all operations including create, update, and delete room features

### Step 1: Create Account (if you don't have one)

**Endpoint:** `POST /api/v1/users/signup`

**Request Body:**
```json
{
    "name": "Your Name",
    "surname": "Your Surname", 
    "email": "your@email.com",
    "password": "yourpassword123",
    "role": "admin"
}
```

**Notes:**
- The `role` field is optional and defaults to `"normal"` if not specified
- Valid roles are: `"normal"` or `"admin"`
- Only admin users can create, update, or delete room features

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

**⚠️ ADMIN ONLY ENDPOINT**

**Endpoint:** `POST /api/v1/room-features`

**Headers:**
- `Authorization: Bearer <your-jwt-token>` (Must be an admin user)
- `Content-Type: application/json`

**Authorization:** This endpoint requires admin privileges. Normal users will receive:
```json
{
    "status": "error",
    "message": "Access denied. Admin privileges required."
}
```

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

**Authorization:** Available to all authenticated users (normal and admin).

### Get Room by ID

**Endpoint:** `GET /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>`

**Authorization:** Available to all authenticated users (normal and admin).

### Update Room

**⚠️ ADMIN ONLY ENDPOINT**

**Endpoint:** `PUT /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>` (Must be an admin user)
- `Content-Type: application/json`

**Authorization:** This endpoint requires admin privileges. Normal users will receive:
```json
{
    "status": "error",
    "message": "Access denied. Admin privileges required."
}
```

**Request Body:** (same format as create, but all fields optional)

### Delete Room

**⚠️ ADMIN ONLY ENDPOINT**

**Endpoint:** `DELETE /api/v1/room-features/{id}`

**Headers:**
- `Authorization: Bearer <your-jwt-token>` (Must be an admin user)

**Authorization:** This endpoint requires admin privileges. Normal users will receive:
```json
{
    "status": "error",
    "message": "Access denied. Admin privileges required."
}
```

## Common Issues

### 1. Authorization Errors
**Problem:** "Access denied. Admin privileges required."
**Solution:** 
- Make sure you're logged in as an admin user
- Check your user role by creating an account with `"role": "admin"`
- Normal users can only view room features, not create/update/delete them

### 2. Field Name Mismatch Error
**Problem:** You're getting validation errors for all fields
**Solution:** Use camelCase field names, not snake_case:
- ❌ `room_number` → ✅ `roomNumber`
- ❌ `room_type` → ✅ `roomType`
- ❌ `area_sqm` → ✅ `areaSqm`
- ❌ `window_count` → ✅ `windowCount`
- ❌ `has_natural_light` → ✅ `hasNaturalLight`
- etc.

### 3. Authentication Error
**Problem:** "Token could not be found" or "Cannot POST /api/room-features"
**Solution:** 
- Make sure you're using the correct endpoint: `/api/v1/room-features`
- Include `Authorization: Bearer <token>` header
- Token expires in 30 minutes, get a new one if needed

### 4. Room Type Validation Error
**Problem:** "Room type must be one of: classroom, study_room, lab, office, meeting_room"
**Solution:** Use exactly one of the valid room types listed above

## Test Users

For testing purposes, you can create users with different roles:

### Create Admin User
```json
{
    "name": "Admin",
    "surname": "User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
}
```

### Create Normal User
```json
{
    "name": "Normal",
    "surname": "User", 
    "email": "normal@example.com",
    "password": "password123",
    "role": "normal"
}
```

## Role-Based Access Control Summary

| Operation | Normal User | Admin User |
|-----------|-------------|------------|
| View room features (GET) | ✅ Allowed | ✅ Allowed |
| Create room features (POST) | ❌ Denied | ✅ Allowed |
| Update room features (PUT) | ❌ Denied | ✅ Allowed |
| Delete room features (DELETE) | ❌ Denied | ✅ Allowed |

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
