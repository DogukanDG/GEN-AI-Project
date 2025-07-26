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
exports.login = login;
exports.register = register;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createLoginToken = createLoginToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = __importStar(require("../user/user.repository"));
const errors_1 = require("../../types/errors");
const SECRET = process.env.JWT_SECRET;
const SALT_LENGTH = 12;
/**
 * Creates a login token for a user and returns it. If any error occurs,
 * it throws that specific error.
 * @param email User's email
 * @param password User's password
 * @returns User data with token
 */
async function login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new errors_1.HttpError(404, 'Account not found. Please check your email');
    }
    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.HttpError(401, 'Password is wrong. Please try again');
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
async function register(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new errors_1.HttpError(409, 'User with this email already exists');
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
async function hashPassword(password) {
    try {
        return await bcryptjs_1.default.hash(password, SALT_LENGTH);
    }
    catch {
        throw new errors_1.HttpError(500, 'Password could not be hashed');
    }
}
async function verifyPassword(password, hashedPassword) {
    try {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    catch {
        throw new errors_1.HttpError(500, 'Password could not be compared');
    }
}
function createLoginToken(id, email) {
    try {
        return jsonwebtoken_1.default.sign({ id, email }, SECRET, { expiresIn: '30m' });
    }
    catch {
        throw new errors_1.HttpError(500, 'Token could not be created');
    }
}
