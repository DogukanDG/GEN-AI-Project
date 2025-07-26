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
 * @returns User data with token
 */
export async function login(email: string, password: string): Promise<{ user: any; token: string }> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new HttpError(404, 'Account not found. Please check your email');
  }

  const isPasswordCorrect = await verifyPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new HttpError(401, 'Password is wrong. Please try again');
  }

  const token = createLoginToken(user.id, user.email);

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Registers a new user and returns user data with token
 * @param userData User registration data
 * @returns User data with token
 */
export async function register(userData: {
  name: string;
  surname: string;
  email: string;
  password: string;
}): Promise<{ user: any; token: string }> {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new HttpError(409, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create user
  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  // Create token
  const token = createLoginToken(user.id, user.email);

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
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
