const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validateRoomData() {
  try {
    console.log('🔍 Validating room data integration...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Count total records
    const totalCount = await prisma.roomFeature.count();
    console.log(`📊 Total room records: ${totalCount}`);
    
    if (totalCount > 0) {
      console.log('✅ Room data has been successfully imported to PostgreSQL');
      
      // Get first few records to verify structure
      const sampleRooms = await prisma.roomFeature.findMany({
        take: 3,
        orderBy: { id: 'asc' }
      });
      
      console.log('\n📋 Sample room data:');
      sampleRooms.forEach((room, index) => {
        console.log(`   Room ${index + 1}:`);
        console.log(`     Room Number: ${room.roomNumber}`);
        console.log(`     Floor: ${room.floor}`);
        console.log(`     Type: ${room.roomType}`);
        console.log(`     Capacity: ${room.capacity}`);
        console.log(`     Area: ${room.areaSqm} sqm`);
        console.log(`     Features: Projector: ${room.hasProjector}, AC: ${room.hasAirConditioner}`);
        console.log('');
      });
      
      // Count by room type
      const classrooms = await prisma.roomFeature.count({
        where: { roomType: 'classroom' }
      });
      const studyRooms = await prisma.roomFeature.count({
        where: { roomType: 'study_room' }
      });
      
      console.log('📈 Room Statistics:');
      console.log(`   Total rooms: ${totalCount}`);
      console.log(`   Classrooms: ${classrooms}`);
      console.log(`   Study rooms: ${studyRooms}`);
      
    } else {
      console.log('❌ No room data found. Import may have failed.');
    }
    
    console.log('\n✨ Validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation
validateRoomData()
  .then(() => {
    console.log('🎉 Room data integration validation successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Validation failed:', error);
    process.exit(1);
  });
