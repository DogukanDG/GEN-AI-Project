"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = exports.HttpBodyValidationError = exports.HttpError = exports.ErrorStatus = void 0;
/**
 * A helper enum for response status of the error handler.
 */
exports.ErrorStatus = {
    Fail: 'fail',
    Error: 'error',
};
class HttpError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.HttpError = HttpError;
class HttpBodyValidationError extends HttpError {
    errors;
    constructor(statusCode, errors) {
        super(statusCode, 'Field Validation Error');
        this.errors = errors;
    }
}
exports.HttpBodyValidationError = HttpBodyValidationError;
class NotFoundError extends HttpError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends HttpError {
    constructor(message = 'Bad request') {
        super(400, message);
    }
}
exports.BadRequestError = BadRequestError;
