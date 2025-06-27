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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService = __importStar(require("../auth.service"));
const userRepository = __importStar(require("../../user/user.repository"));
const errors_1 = require("../../../types/errors");
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
            const user = { id: 1, email, password: 'hashed-password' };
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
            const passwordIsCorrect = true;
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => passwordIsCorrect);
            const expectedToken = 'jwt-token';
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementation(() => expectedToken);
            // Act
            const token = await authService.login(email, password);
            // Expect
            expect(token).toBe(expectedToken);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(bcryptjs_1.default.compare).toHaveBeenCalledWith(password, user.password);
        });
        it('should throw error if user is not found', async () => {
            // Arrange
            const email = 'user@email.com';
            const password = 'user-password';
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
            // Act & Expect
            await expect(authService.login(email, password)).rejects.toThrow('Account not found. Please check your email');
        });
        it('should throw error if password is incorrect', async () => {
            // Arrange
            const email = 'user@email.com';
            const password = 'wrong-password';
            const user = { id: 1, email, password: 'hashed-password' };
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
            const PasswordIsWrong = false;
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => PasswordIsWrong);
            // Act & Expect
            await expect(authService.login(email, password)).rejects.toThrow('Password is wrong. Please try again');
        });
        it('should throw error if token generation fails', async () => {
            // Arrange
            const email = 'user@email.com';
            const password = 'user-password';
            const user = { id: 1, email, password: 'hashed-password' };
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
            const passwordIsCorrect = true;
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => passwordIsCorrect);
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementation(() => {
                throw new errors_1.HttpError(500, 'Token could not be created');
            });
            // Act & Expect
            await expect(authService.login(email, password)).rejects.toThrow('Token could not be created');
        });
    });
    describe('hashPassword', () => {
        it('should give hashed password', async () => {
            // Arrange
            const password = 'user-password';
            const mockHashedPassword = 'user-hashed-password';
            jest.spyOn(bcryptjs_1.default, 'hash').mockImplementation(() => mockHashedPassword);
            // Act
            const hashedPassword = await authService.hashPassword(password);
            // Expect
            expect(hashedPassword).toBe(mockHashedPassword);
        });
        it('should throw error if password cannot be hashed', async () => {
            // Arrange
            const password = 'user-password';
            jest.spyOn(bcryptjs_1.default, 'hash').mockImplementation(() => {
                throw new errors_1.HttpError(500, 'Password could not be hashed');
            });
            // Act & Expect
            await expect(authService.hashPassword(password)).rejects.toThrow(errors_1.HttpError);
        });
    });
    describe('verifyPassword', () => {
        it('should check if the password is correct', async () => {
            // Arrange
            const password = 'user-password';
            const hashedPassword = 'user-hashed-password';
            const passwordIsCorrect = true;
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => passwordIsCorrect);
            // Act
            const isPasswordCorrect = await authService.verifyPassword(password, hashedPassword);
            // Expect
            expect(isPasswordCorrect).toBe(passwordIsCorrect);
        });
        it('should throw error if password cannot be compared', async () => {
            // Arrange
            const password = 'user-password';
            const hashedPassword = 'user-hashed-password';
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => {
                throw new errors_1.HttpError(500, 'Password could not be compared');
            });
            // Act & Expect
            await expect(authService.verifyPassword(password, hashedPassword)).rejects.toThrow(errors_1.HttpError);
        });
    });
    describe('createLoginToken', () => {
        it('should generate login token', () => {
            // Arrange
            const userId = 1;
            const userEmail = 'user@email.com';
            const expectedToken = 'jwt-token';
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementation(() => expectedToken);
            // Act
            const token = authService.createLoginToken(userId, userEmail);
            // Expect
            expect(token).toBe(expectedToken);
        });
        it('should throw error if login token cannot be generated', () => {
            // Arrange
            const userId = 1;
            const userEmail = 'user@email.com';
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementation(() => {
                throw new errors_1.HttpError(500, 'Token could not be created');
            });
            // Act & Expect
            expect(() => authService.createLoginToken(userId, userEmail)).toThrow(errors_1.HttpError);
        });
    });
});
