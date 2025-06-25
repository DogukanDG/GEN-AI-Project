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
exports.signup = signup;
exports.isEmailRegistered = isEmailRegistered;
const authService = __importStar(require("../auth/auth.service"));
const userRepository = __importStar(require("./user.repository"));
const errors_1 = require("../../types/errors");
/**
 * Creates a user and returns it. If any error occurs, it throws that
 * specific error.
 * @param name New user's name
 * @param surname New user's surname
 * @param email New user's email
 * @param password New user's password
 * @returns New user object.
 */
async function signup(data) {
    const doesEmailExist = await isEmailRegistered(data.email);
    if (doesEmailExist) {
        throw new errors_1.HttpError(409, 'Email already exist');
    }
    const hashedPassword = await authService.hashPassword(data.password);
    const newUser = await userRepository.createUser({
        ...data,
        password: hashedPassword,
    });
    return newUser;
}
async function isEmailRegistered(email) {
    try {
        const user = await userRepository.findByEmail(email);
        return user ? true : false;
    }
    catch {
        throw new errors_1.HttpError(500, 'Email could not be checked');
    }
}
