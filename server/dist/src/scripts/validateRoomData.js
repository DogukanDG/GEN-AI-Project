"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
                console.log(`     ID: ${room.id}`);
                // Note: Due to TypeScript compilation issues, we'll access properties dynamically
                console.log(`     Data: ${JSON.stringify(room, null, 2)}`);
            });
        }
        else {
            console.log('❌ No room data found. Import may have failed.');
        }
        console.log('\n✨ Validation completed!');
    }
    catch (error) {
        console.error('❌ Validation failed:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Run validation
if (require.main === module) {
    validateRoomData()
        .then(() => {
        console.log('🎉 Room data integration validation successful!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Validation failed:', error);
        process.exit(1);
    });
}
exports.default = validateRoomData;
