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
        DatabaseClient.instance = new PrismaClient();
      } catch (error) {
        throw new Error('Failed to create Prisma Client instance: ' + error);
      }
    }
    return DatabaseClient.instance;
  }
}

const prisma = DatabaseClient.getInstance();

export default prisma;
