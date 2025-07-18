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
        role: data.role || 'normal',
      },
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

export async function findAllUsers(): Promise<User[]> {
  try {
    return await prisma.user.findMany();
  } catch {
    throw new HttpError(500, 'Users could not be fetched');
  }
}

export async function findUserById(id: number): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    throw new HttpError(500, 'User could not be fetched');
  }
}

export async function updateUser(
  id: number,
  data: Partial<Omit<User, 'id'>>
): Promise<User> {
  try {
    return await prisma.user.update({ where: { id }, data });
  } catch {
    throw new HttpError(500, 'User could not be updated');
  }
}

export async function deleteUser(id: number): Promise<User> {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch {
    throw new HttpError(500, 'User could not be deleted');
  }
}
