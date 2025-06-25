import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RoomDummyData } from '../types/roomFeature';

const prisma = new PrismaClient();

async function importRoomData() {
  try {
    console.log('🚀 Starting room data import...');
    
    // Read the JSON file
    const dataPath = join(__dirname, '../data/room_dummy_data.json');
    const jsonData = readFileSync(dataPath, 'utf-8');
    const roomData: RoomDummyData[] = JSON.parse(jsonData);
    
    console.log(`📊 Found ${roomData.length} rooms to import`);
    
    // Clear existing data (optional)
    console.log('🧹 Clearing existing room data...');
    await prisma.roomFeature.deleteMany();
    
    // Import new data
    console.log('📥 Importing new room data...');
    const importedRooms = [];
    
    for (const room of roomData) {
      const newRoom = await prisma.roomFeature.create({
        data: {
          roomNumber: room.room_number,
          floor: room.floor,
          roomType: room.room_type,
          capacity: room.capacity,
          areaSqm: room.area_sqm,
          windowCount: room.window_count,
          hasNaturalLight: room.has_natural_light,
          hasProjector: room.has_projector,
          hasMicrophone: room.has_microphone,
          hasCamera: room.has_camera,
          hasAirConditioner: room.has_air_conditioner,
          hasNoiseCancelling: room.has_noise_cancelling,
        },
      });
      importedRooms.push(newRoom);
      console.log(`✅ Imported room: ${newRoom.roomNumber}`);
    }
    
    console.log(`🎉 Successfully imported ${importedRooms.length} rooms!`);
    
    // Display summary
    const totalRooms = await prisma.roomFeature.count();
    const classrooms = await prisma.roomFeature.count({
      where: { roomType: 'classroom' }
    });
    const studyRooms = await prisma.roomFeature.count({
      where: { roomType: 'study_room' }
    });
    
    console.log('\n📈 Import Summary:');
    console.log(`Total rooms: ${totalRooms}`);
    console.log(`Classrooms: ${classrooms}`);
    console.log(`Study rooms: ${studyRooms}`);
    
  } catch (error) {
    console.error('❌ Error importing room data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  importRoomData()
    .then(() => {
      console.log('✨ Room data import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Room data import failed:', error);
      process.exit(1);
    });
}

export default importRoomData;
