import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { LoginJwtPayload, CustomJwtPayload } from '../types/customJwtPayload';
import { HttpError } from '../types/errors';

declare module 'express-serve-static-core' {
  interface Request {
    userId: number;
    user: CustomJwtPayload;
  }
}

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get('Authorization');
  console.log('Gelen Authorization header:', authHeader);
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }
  console.log('Çıkarılan token:', token);
  if (!token) {
    throw new HttpError(401, 'Token could not be found');
  }

  let decodedData: LoginJwtPayload;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET!) as LoginJwtPayload;
  } catch {
    throw new HttpError(500, 'Token could not be verified');
  }

  if (!decodedData) {
    throw new HttpError(401, 'User is not authenticated');
  }

  req.userId = decodedData.id;
  req.user = decodedData as CustomJwtPayload;

  next();
};
