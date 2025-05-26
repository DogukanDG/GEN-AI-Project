import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authService from '../auth.service';
import * as userRepository from '../../user/user.repository';
import { HttpError } from '../../../types/errors';
import { User } from '@prisma/client';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../user/user.repository');

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a login token when credentials are correct', async () => {
      // Arrange
      const email = 'user@email.com';
      const password = 'user-password';

      const user = { id: 1, email, password: 'hashed-password' } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      const passwordIsCorrect = true;
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => passwordIsCorrect);

      const expectedToken = 'jwt-token';
      jest.spyOn(jwt, 'sign').mockImplementation(() => expectedToken);

      // Act
      const token = await authService.login(email, password);

      // Expect
      expect(token).toBe(expectedToken);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should throw error if user is not found', async () => {
      // Arrange
      const email = 'user@email.com';
      const password = 'user-password';

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      // Act & Expect
      await expect(authService.login(email, password)).rejects.toThrow(
        'Account not found. Please check your email'
      );
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      const email = 'user@email.com';
      const password = 'wrong-password';

      const user = { id: 1, email, password: 'hashed-password' } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      const PasswordIsWrong = false;
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => PasswordIsWrong);

      // Act & Expect
      await expect(authService.login(email, password)).rejects.toThrow(
        'Password is wrong. Please try again'
      );
    });

    it('should throw error if token generation fails', async () => {
      // Arrange
      const email = 'user@email.com';
      const password = 'user-password';

      const user = { id: 1, email, password: 'hashed-password' } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      const passwordIsCorrect = true;
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => passwordIsCorrect);

      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new HttpError(500, 'Token could not be created');
      });

      // Act & Expect
      await expect(authService.login(email, password)).rejects.toThrow(
        'Token could not be created'
      );
    });
  });

  describe('hashPassword', () => {
    it('should give hashed password', async () => {
      // Arrange
      const password = 'user-password';

      const mockHashedPassword = 'user-hashed-password';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => mockHashedPassword);

      // Act
      const hashedPassword = await authService.hashPassword(password);

      // Expect
      expect(hashedPassword).toBe(mockHashedPassword);
    });

    it('should throw error if password cannot be hashed', async () => {
      // Arrange
      const password = 'user-password';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        throw new HttpError(500, 'Password could not be hashed');
      });

      // Act & Expect
      await expect(authService.hashPassword(password)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('verifyPassword', () => {
    it('should check if the password is correct', async () => {
      // Arrange
      const password = 'user-password';
      const hashedPassword = 'user-hashed-password';

      const passwordIsCorrect = true;
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => passwordIsCorrect);

      // Act
      const isPasswordCorrect = await authService.verifyPassword(
        password,
        hashedPassword
      );

      // Expect
      expect(isPasswordCorrect).toBe(passwordIsCorrect);
    });

    it('should throw error if password cannot be compared', async () => {
      // Arrange
      const password = 'user-password';
      const hashedPassword = 'user-hashed-password';

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new HttpError(500, 'Password could not be compared');
      });

      // Act & Expect
      await expect(
        authService.verifyPassword(password, hashedPassword)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('createLoginToken', () => {
    it('should generate login token', () => {
      // Arrange
      const userId = 1;
      const userEmail = 'user@email.com';

      const expectedToken = 'jwt-token';
      jest.spyOn(jwt, 'sign').mockImplementation(() => expectedToken);

      // Act
      const token = authService.createLoginToken(userId, userEmail);

      // Expect
      expect(token).toBe(expectedToken);
    });

    it('should throw error if login token cannot be generated', () => {
      // Arrange
      const userId = 1;
      const userEmail = 'user@email.com';

      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new HttpError(500, 'Token could not be created');
      });

      // Act & Expect
      expect(() => authService.createLoginToken(userId, userEmail)).toThrow(
        HttpError
      );
    });
  });
});
