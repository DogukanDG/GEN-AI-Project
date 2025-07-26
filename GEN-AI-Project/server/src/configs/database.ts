import { PrismaClient } from '@prisma/client';
import { checkEnvironmentVariables } from '../utils/environmentUtils';

const databaseEnvironments: string[] = ['DATABASE_URL'];

/**
 * @description DatabaseClient class is used to create a single Prisma Client instance.
 *
 */
class DatabaseClient {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      try {
        checkEnvironmentVariables(databaseEnvironments);
        DatabaseClient.instance = new PrismaClient({
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
      } catch (error) {
        console.error('❌ Failed to create Prisma Client instance:', error);
        throw new Error('Failed to create Prisma Client instance: ' + error);
      }
    }
    return DatabaseClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
      console.log('🔌 Database disconnected');
    }
  }
}

const prisma = DatabaseClient.getInstance();

export default prisma;
