"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const errors_1 = require("../types/errors");
const errors_2 = require("../types/errors");
const handleError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    if (error instanceof errors_1.HttpBodyValidationError) {
        const errors = error.errors;
        res.status(statusCode).json({
            status: errors_2.ErrorStatus.Fail,
            data: errors,
        });
    }
    else {
        const message = error.message;
        res.status(statusCode).json({
            status: errors_2.ErrorStatus.Error,
            message,
        });
    }
};
exports.handleError = handleError;
