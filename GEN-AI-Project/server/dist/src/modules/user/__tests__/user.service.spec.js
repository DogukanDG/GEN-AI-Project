"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository = __importStar(require("../user.repository"));
const userService = __importStar(require("../user.service"));
const authService = __importStar(require("../../auth/auth.service"));
const errors_1 = require("../../../types/errors");
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
            const newUser = { id: 1, ...data, password: hashedPassword };
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
            const user = { id: 1 };
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
            // Act & Expect
            await expect(userService.signup(data)).rejects.toThrow(new errors_1.HttpError(409, 'Email already exist'));
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
                .mockRejectedValue(new errors_1.HttpError(500, 'Password could not be hashed'));
            // Act & Expect
            await expect(userService.signup(data)).rejects.toThrow(new errors_1.HttpError(500, 'Password could not be hashed'));
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
                .mockRejectedValue(new errors_1.HttpError(500, 'User could not be created'));
            // Act & Expect
            await expect(userService.signup(data)).rejects.toThrow(new errors_1.HttpError(500, 'User could not be created'));
        });
    });
    describe('isEmailRegistered', () => {
        it('should return true if email is registered', async () => {
            // Arrange
            const email = 'user@email.com';
            const user = { id: 1 };
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
                throw new errors_1.HttpError(500, 'Email could not be checked');
            });
            // Act & Expect
            await expect(userService.isEmailRegistered(email)).rejects.toThrow('Email could not be checked');
        });
    });
});
