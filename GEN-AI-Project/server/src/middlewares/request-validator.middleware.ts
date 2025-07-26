import { Request, Response, NextFunction } from 'express';
import { HttpBodyValidationError } from '../types/errors';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpBodyValidationError(400, errors.array());
  }

  next();
};
