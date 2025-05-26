import { Request, Response, NextFunction } from 'express';
import { HttpBodyValidationError } from '../types/errors';
import { HandlerError, ApplicationError, ErrorStatus } from '../types/errors';

export const handleError = (
  error: HandlerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (error as ApplicationError).statusCode || 500;

  if (error instanceof HttpBodyValidationError) {
    const errors = error.errors;

    res.status(statusCode).json({
      status: ErrorStatus.Fail,
      data: errors,
    });
  } else {
    const message = error.message;

    res.status(statusCode).json({
      status: ErrorStatus.Error,
      message,
    });
  }
};
