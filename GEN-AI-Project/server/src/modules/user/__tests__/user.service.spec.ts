import { User } from '@prisma/client';
import * as userRepository from '../user.repository';
import * as userService from '../user.service';
import * as authService from '../../auth/auth.service';
import { HttpError } from '../../../types/errors';

jest.mock('../user.repository');
jest.mock('../../auth/auth.service');

describe('userService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('signup', () => {
    it('should successfully create new user if email is not registered', async () => {
      // Arrange
      const data = {
        name: 'John',
        surname: 'Doe',
        email: 'user@email.com',
        password: 'password123',
      };

      // for userService.isEmailRegistered()
      const user = null;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      const hashedPassword = 'hashedPassword';
      jest.spyOn(authService, 'hashPassword').mockResolvedValue(hashedPassword);

      const newUser = { id: 1, ...data, password: hashedPassword } as User;
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(newUser);

      // Act
      const result = await userService.signup(data);

      // Act & Expect
      expect(result).toEqual(newUser);
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const data = {
        name: 'John',
        surname: 'Doe',
        email: 'user@email.com',
        password: 'password123',
      };

      // for userService.isEmailRegistered()
      const user = { id: 1 } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      // Act & Expect
      await expect(userService.signup(data)).rejects.toThrow(
        new HttpError(409, 'Email already exist')
      );
    });

    it('should throw error if password hashing fails', async () => {
      // Arrange
      const data = {
        name: 'John',
        surname: 'Doe',
        email: 'user@email.com',
        password: 'password123',
      };

      // for userService.isEmailRegistered()
      const user = null;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      jest
        .spyOn(authService, 'hashPassword')
        .mockRejectedValue(new HttpError(500, 'Password could not be hashed'));

      // Act & Expect
      await expect(userService.signup(data)).rejects.toThrow(
        new HttpError(500, 'Password could not be hashed')
      );
    });

    it('should throw error if user creation fails', async () => {
      // Arrange
      const data = {
        name: 'John',
        surname: 'Doe',
        email: 'user@email.com',
        password: 'password123',
      };

      // for userService.isEmailRegistered()
      const user = null;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      const hashedPassword = 'hashedPassword123';
      jest.spyOn(authService, 'hashPassword').mockResolvedValue(hashedPassword);

      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValue(new HttpError(500, 'User could not be created'));

      // Act & Expect
      await expect(userService.signup(data)).rejects.toThrow(
        new HttpError(500, 'User could not be created')
      );
    });
  });

  describe('isEmailRegistered', () => {
    it('should return true if email is registered', async () => {
      // Arrange
      const email = 'user@email.com';

      const user = { id: 1 } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

      // Act
      const emailRegistered = await userService.isEmailRegistered(email);

      // Act & Expect
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(emailRegistered).toBe(true);
    });

    it('should return false if email is not found', async () => {
      // Arrange
      const email = 'user@email.com';

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      // Act
      const emailNotFound = await userService.isEmailRegistered(email);

      // Expect
      expect(emailNotFound).toBe(false);
    });

    it('should throw error if there is error in findByEmail', async () => {
      // Arrange
      const email = 'user@email.com';

      jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => {
        throw new HttpError(500, 'Email could not be checked');
      });

      // Act & Expect
      await expect(userService.isEmailRegistered(email)).rejects.toThrow(
        'Email could not be checked'
      );
    });
  });
});
