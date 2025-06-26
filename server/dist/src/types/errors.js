"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBodyValidationError = exports.HttpError = exports.ErrorStatus = void 0;
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
