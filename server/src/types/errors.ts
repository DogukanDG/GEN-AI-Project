// import { ValidationError } from 'express-validator';

/**
 * ApplicationError contains all custom errors. This type is helpful for
 * the error handler to use the statusCode of these errors. So, to add a new type
 * to ApplicationError, the new error should have a `statusCode` property.
 */
export type ApplicationError = HttpError | HttpBodyValidationError;

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
  public errors: any[];
  constructor(statusCode: number, errors: any[]) {
    super(statusCode, 'Field Validation Error');
    this.errors = errors;
  }
}
