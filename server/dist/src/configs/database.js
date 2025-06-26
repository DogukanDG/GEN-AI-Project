"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const environmentUtils_1 = require("../utils/environmentUtils");
const databaseEnvironments = ['DATABASE_URL'];
/**
 * @description DatabaseClient class is used to create a single Prisma Client instance.
 *
 */
class DatabaseClient {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DatabaseClient.instance) {
            try {
                (0, environmentUtils_1.checkEnvironmentVariables)(databaseEnvironments);
                DatabaseClient.instance = new client_1.PrismaClient({
                    log: ['query', 'info', 'warn', 'error'],
                    errorFormat: 'pretty',
                });
                // Test the connection
                DatabaseClient.instance.$connect().then(() => {
                    console.log('✅ Database connected successfully');
                }).catch((error) => {
                    console.error('❌ Database connection failed:', error);
                    throw error;
                });
            }
            catch (error) {
                console.error('❌ Failed to create Prisma Client instance:', error);
                throw new Error('Failed to create Prisma Client instance: ' + error);
            }
        }
        return DatabaseClient.instance;
    }
    static async disconnect() {
        if (DatabaseClient.instance) {
            await DatabaseClient.instance.$disconnect();
            console.log('🔌 Database disconnected');
        }
    }
}
const prisma = DatabaseClient.getInstance();
exports.default = prisma;
