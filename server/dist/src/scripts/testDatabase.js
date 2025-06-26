"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testDatabase() {
    try {
        console.log('🔍 Testing database connection and data...');
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connection successful');
        // Count total rooms
        const totalRooms = await prisma.roomFeature.count();
        console.log(`📊 Total rooms in database: ${totalRooms}`);
        // Count by room type
        const classrooms = await prisma.roomFeature.count({
            where: { roomType: 'classroom' }
        });
        const studyRooms = await prisma.roomFeature.count({
            where: { roomType: 'study_room' }
        });
        console.log(`🏫 Classrooms: ${classrooms}`);
        console.log(`📚 Study rooms: ${studyRooms}`);
        // Get a sample room
        const sampleRoom = await prisma.roomFeature.findFirst({
            where: { roomNumber: 'L.0.01' }
        });
        if (sampleRoom) {
            console.log('📋 Sample room data:');
            console.log(`   Room Number: ${sampleRoom.roomNumber}`);
            console.log(`   Type: ${sampleRoom.roomType}`);
            console.log(`   Capacity: ${sampleRoom.capacity}`);
            console.log(`   Area: ${sampleRoom.areaSqm} sqm`);
            console.log(`   Features: Projector: ${sampleRoom.hasProjector}, AC: ${sampleRoom.hasAirConditioner}`);
        }
        // Test aggregations
        const stats = await prisma.roomFeature.aggregate({
            _avg: {
                capacity: true,
                areaSqm: true,
            },
            _max: {
                capacity: true,
                areaSqm: true,
            },
            _min: {
                capacity: true,
                areaSqm: true,
            }
        });
        console.log('\n📈 Room Statistics:');
        console.log(`   Average Capacity: ${stats._avg.capacity?.toFixed(1)} people`);
        console.log(`   Average Area: ${stats._avg.areaSqm?.toFixed(1)} sqm`);
        console.log(`   Largest Room: ${stats._max.capacity} people, ${stats._max.areaSqm} sqm`);
        console.log(`   Smallest Room: ${stats._min.capacity} people, ${stats._min.areaSqm} sqm`);
        console.log('\n✨ Database test completed successfully!');
    }
    catch (error) {
        console.error('❌ Database test failed:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Run the test
if (require.main === module) {
    testDatabase()
        .then(() => {
        console.log('🎉 Test completed!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Test failed:', error);
        process.exit(1);
    });
}
exports.default = testDatabase;
