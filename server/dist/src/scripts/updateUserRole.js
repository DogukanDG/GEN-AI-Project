"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function updateUserRole() {
    try {
        // Update the first user to admin role for testing
        const updatedUser = await prisma.user.update({
            where: { email: 'Soykok@gmail.com' },
            data: { role: 'admin' }
        });
        console.log('✅ User updated to admin role:', {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
        // Show all users and their roles
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        console.log('\n📋 All users and their roles:');
        allUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email}): ${user.role}`);
        });
    }
    catch (error) {
        console.error('❌ Error updating user role:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
updateUserRole();
