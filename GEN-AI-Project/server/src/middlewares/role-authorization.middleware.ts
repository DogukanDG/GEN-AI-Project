import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/errors';
import prisma from '../configs/database';

declare module 'express-serve-static-core' {
  interface Request {
    userRole?: string;
  }
}

/**
 * Middleware to check if the authenticated user has admin role
 * This middleware should be used after the authorizeUser middleware
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // The userId should already be set by the authorizeUser middleware
    if (!req.userId) {
      throw new HttpError(401, 'User not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    if (user.role !== 'admin') {
      throw new HttpError(403, 'Access denied. Admin privileges required.');
    }

    // Store user role in request for potential future use
    req.userRole = user.role;

    await prisma.$disconnect();
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if the authenticated user has admin or normal role
 * and set the user role in the request object
 */
export const setUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // The userId should already be set by the authorizeUser middleware
    if (!req.userId) {
      throw new HttpError(401, 'User not authenticated');
    }

    // Get user from database to check role
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    // Store user role in request
    req.userRole = user.role;

    await prisma.$disconnect();
    next();
  } catch (error) {
    next(error);
  }
};
