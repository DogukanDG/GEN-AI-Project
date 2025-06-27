"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findByEmail = findByEmail;
const database_1 = __importDefault(require("../../configs/database"));
const errors_1 = require("../../types/errors");
async function createUser(data) {
    try {
        return await database_1.default.user.create({
            data: {
                ...data,
                role: data.role || 'normal'
            }
        });
    }
    catch {
        throw new errors_1.HttpError(500, 'User could not be created');
    }
}
async function findByEmail(email) {
    try {
        return await database_1.default.user.findUnique({ where: { email } });
    }
    catch {
        throw new errors_1.HttpError(500, 'Data could not be fetched');
    }
}
