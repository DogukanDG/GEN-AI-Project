import prisma from '../../configs/database';
import { User } from '@prisma/client';
import { HttpError } from '../../types/errors';

export async function createUser(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> {
  try {
    return await prisma.user.create({ 
      data: {
        ...data,
        role: data.role || 'normal'
      }
    });
  } catch {
    throw new HttpError(500, 'User could not be created');
  }
}

export async function findByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    throw new HttpError(500, 'Data could not be fetched');
  }
}
