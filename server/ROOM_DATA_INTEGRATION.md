# Room Data Integration

This document describes how the room dummy data has been integrated into the AI Facility Management project.

## Overview

The room dummy data has been successfully integrated into the PostgreSQL database with a completely updated schema that reflects the room properties and features.

## Database Schema Changes

The `RoomFeature` model has been updated to include the following properties:

### Room Properties
- `roomNumber` - Unique identifier for each room (e.g., "L.0.01")
- `floor` - Floor number (0, 1, 2, 3)
- `roomType` - Type of room ("classroom" or "study_room")
- `capacity` - Number of people the room can accommodate
- `areaSqm` - Room area in square meters
- `windowCount` - Number of windows in the room

### Room Features (Boolean)
- `hasNaturalLight` - Whether the room has natural light
- `hasProjector` - Whether the room has a projector
- `hasMicrophone` - Whether the room has a microphone
- `hasCamera` - Whether the room has a camera
- `hasAirConditioner` - Whether the room has air conditioning
- `hasNoiseCancelling` - Whether the room has noise cancelling features

## Data Statistics

- **Total Rooms**: 24
- **Classrooms**: 12
- **Study Rooms**: 12
- **Floors**: 4 floors (0-3)
- **Capacity Range**: 6-50 people
- **Area Range**: 12-70 sqm

## Available Scripts

### Import Room Data
```bash
npm run db:import-rooms
```
This script will:
- Clear existing room data
- Import all 24 rooms from the dummy data
- Display import progress and summary

### Validate Room Data
```bash
npm run db:validate-rooms
```
This script validates that the room data has been properly imported.

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Prisma Studio (visual database browser)
npm run db:studio

# Reset database (caution: this deletes all data)
npm run db:reset
```

## API Endpoints

The room feature endpoints have been updated to work with the new schema:

### GET /api/roomFeatures
Returns all room features with their properties.

### POST /api/roomFeatures
Create a new room feature. Required fields:
```json
{
  "roomNumber": "string",
  "floor": "number",
  "roomType": "classroom|study_room",
  "capacity": "number",
  "areaSqm": "number",
  "windowCount": "number",
  "hasNaturalLight": "boolean",
  "hasProjector": "boolean",
  "hasMicrophone": "boolean",
  "hasCamera": "boolean",
  "hasAirConditioner": "boolean",
  "hasNoiseCancelling": "boolean"
}
```

### PUT /api/roomFeatures/:id
Update an existing room feature.

### DELETE /api/roomFeatures/:id
Delete a room feature.

## Data Structure Example

```json
{
  "id": 1,
  "roomNumber": "L.0.01",
  "floor": 0,
  "roomType": "classroom",
  "capacity": 45,
  "areaSqm": 65.0,
  "windowCount": 3,
  "hasNaturalLight": true,
  "hasProjector": true,
  "hasMicrophone": true,
  "hasCamera": true,
  "hasAirConditioner": true,
  "hasNoiseCancelling": false,
  "userId": null,
  "createdAt": "2025-06-05T18:30:00.000Z",
  "updatedAt": "2025-06-05T18:30:00.000Z"
}
```

## Migration History

1. **Initial Migration** (`20250526115232_v1`) - Created basic schema
2. **Room Features Update** (`20250605182452_update_room_features_schema`) - Updated schema to match room dummy data structure

## Files Updated

### Backend Files
- `prisma/schema/schema.prisma` - Updated database schema
- `src/types/roomFeature.ts` - Updated TypeScript types
- `src/modules/roomFeature/roomFeature.service.ts` - Updated service logic
- `src/modules/roomFeature/roomFeature.repository.ts` - Updated database queries
- `src/modules/roomFeature/roomFeature.controller.ts` - Updated API endpoints
- `src/modules/roomFeature/roomFeature.validation.ts` - Updated validation rules

### Data Files
- `src/data/room_dummy_data.json` - Room dummy data
- `src/scripts/importRoomData.ts` - Data import script
- `src/scripts/validateRoomData.js` - Data validation script

## Next Steps

1. **Frontend Integration**: Update the frontend to work with the new room data structure
2. **Search and Filtering**: Add room search functionality based on features and capacity
3. **Room Booking**: Implement room booking system using the room data
4. **Analytics**: Create room utilization analytics and reporting

## Troubleshooting

### Prisma Client Generation Issues
If you encounter TypeScript compilation errors after schema changes:

1. Kill any running Node.js processes:
```bash
taskkill /f /im node.exe
```

2. Delete and regenerate Prisma client:
```bash
Remove-Item -Recurse -Force "node_modules\.prisma"
npm run db:generate
```

3. Restart VS Code to refresh TypeScript language server

### Database Connection Issues
- Ensure PostgreSQL database is running
- Check `.env` file for correct `DATABASE_URL`
- Verify database credentials and network connectivity
