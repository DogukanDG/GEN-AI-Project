"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../types/errors");
const authorizeUser = (req, res, next) => {
    const token = req.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new errors_1.HttpError(401, 'Token could not be found');
    }
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch {
        throw new errors_1.HttpError(500, 'Token could not be verified');
    }
    if (!decodedData) {
        throw new errors_1.HttpError(401, 'User is not authenticated');
    }
    req.userId = decodedData.id;
    req.user = decodedData;
    next();
};
exports.authorizeUser = authorizeUser;
