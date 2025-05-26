import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../user/user.repository';
import { HttpError } from '../../types/errors';

const SECRET = process.env.JWT_SECRET!;
const SALT_LENGTH = 12;

/**
 * Creates a login token for a user and returns it. If any error occurs,
 * it throws that specific error.
 * @param email User's email
 * @param password User's password
 * @returns A login token
 */
export async function login(email: string, password: string): Promise<string> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new HttpError(404, 'Account not found. Please check your email');
  }

  const isPasswordCorrect = await verifyPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new HttpError(401, 'Password is wrong. Please try again');
  }

  const token = createLoginToken(user.id, user.email);

  return token;
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_LENGTH);
  } catch {
    throw new HttpError(500, 'Password could not be hashed');
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new HttpError(500, 'Password could not be compared');
  }
}

export function createLoginToken(id: number, email: string): string {
  try {
    return jwt.sign({ id, email }, SECRET, { expiresIn: '30m' });
  } catch {
    throw new HttpError(500, 'Token could not be created');
  }
}
