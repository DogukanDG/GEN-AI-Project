import { ValidationError } from 'express-validator';

/**
 * ApplicationError contains all custom errors. This type is helpful for
 * the error handler to use the statusCode of these errors. So, to add a new type
 * to ApplicationError, the new error should have a `statusCode` property.
 */
export type ApplicationError = HttpError | HttpBodyValidationError | NotFoundError | BadRequestError;

/**
 * Generic type for the error handler's error parameter.
 */
export type HandlerError = Error | ApplicationError;

/**
 * A helper enum for response status of the error handler.
 */
export const ErrorStatus = {
  Fail: 'fail',
  Error: 'error',
} as const;

export class HttpError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class HttpBodyValidationError extends HttpError {
  public errors: ValidationError[];
  constructor(statusCode: number, errors: ValidationError[]) {
    super(statusCode, 'Field Validation Error');
    this.errors = errors;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad request') {
    super(400, message);
  }
}
