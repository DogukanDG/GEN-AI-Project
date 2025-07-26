"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRole = exports.requireAdmin = void 0;
const errors_1 = require("../types/errors");
/**
 * Middleware to check if the authenticated user has admin role
 * This middleware should be used after the authorizeUser middleware
 */
const requireAdmin = async (req, res, next) => {
    try {
        // The userId should already be set by the authorizeUser middleware
        if (!req.userId) {
            throw new errors_1.HttpError(401, 'User not authenticated');
        }
        // Get user from database to check role
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            throw new errors_1.HttpError(404, 'User not found');
        }
        if (user.role !== 'admin') {
            throw new errors_1.HttpError(403, 'Access denied. Admin privileges required.');
        }
        // Store user role in request for potential future use
        req.userRole = user.role;
        await prisma.$disconnect();
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAdmin = requireAdmin;
/**
 * Middleware to check if the authenticated user has admin or normal role
 * and set the user role in the request object
 */
const setUserRole = async (req, res, next) => {
    try {
        // The userId should already be set by the authorizeUser middleware
        if (!req.userId) {
            throw new errors_1.HttpError(401, 'User not authenticated');
        }
        // Get user from database to check role
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            throw new errors_1.HttpError(404, 'User not found');
        }
        // Store user role in request
        req.userRole = user.role;
        await prisma.$disconnect();
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.setUserRole = setUserRole;
