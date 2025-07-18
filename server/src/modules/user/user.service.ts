import { User } from '@prisma/client';
import * as authService from '../auth/auth.service';
import * as userRepository from './user.repository';
import { HttpError } from '../../types/errors';

/**
 * Creates a user and returns it. If any error occurs, it throws that
 * specific error.
 * @param name New user's name
 * @param surname New user's surname
 * @param email New user's email
 * @param password New user's password
 * @param role New user's role (optional, defaults to 'normal')
 * @returns New user object.
 */
export async function signup(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> {
  const doesEmailExist = await isEmailRegistered(data.email);
  if (doesEmailExist) {
    throw new HttpError(409, 'Email already exist');
  }

  const hashedPassword = await authService.hashPassword(data.password);
  const newUser = await userRepository.createUser({
    ...data,
    password: hashedPassword,
    role: data.role || 'normal',
  });

  return newUser;
}

export async function isEmailRegistered(email: string): Promise<boolean> {
  try {
    const user = await userRepository.findByEmail(email);
    return user ? true : false;
  } catch {
    throw new HttpError(500, 'Email could not be checked');
  }
}

export async function getAllUsers(): Promise<User[]> {
  return await userRepository.findAllUsers();
}

export async function getUserById(id: number): Promise<User | null> {
  return await userRepository.findUserById(id);
}

export async function updateUser(
  id: number,
  data: Partial<Omit<User, 'id'>>
): Promise<User> {
  if (data.password) {
    data.password = await authService.hashPassword(data.password);
  }
  return await userRepository.updateUser(id, data);
}

export async function deleteUser(id: number): Promise<User> {
  return await userRepository.deleteUser(id);
}
