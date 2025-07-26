"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationsValidation = exports.updateReservationValidation = exports.createReservationValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createReservationValidation = [
    (0, express_validator_1.body)('roomNumber')
        .notEmpty()
        .withMessage('Room number is required')
        .isString()
        .withMessage('Room number must be a string'),
    (0, express_validator_1.body)('userName')
        .notEmpty()
        .withMessage('User name is required')
        .isString()
        .withMessage('User name must be a string')
        .isLength({ min: 2, max: 100 })
        .withMessage('User name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('userEmail')
        .notEmpty()
        .withMessage('User email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('startDatetime')
        .notEmpty()
        .withMessage('Start datetime is required')
        .isISO8601()
        .withMessage('Start datetime must be a valid ISO 8601 date')
        .custom((value) => {
        const startDate = new Date(value);
        const now = new Date();
        if (startDate <= now) {
            throw new Error('Start datetime must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('endDatetime')
        .notEmpty()
        .withMessage('End datetime is required')
        .isISO8601()
        .withMessage('End datetime must be a valid ISO 8601 date')
        .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDatetime);
        if (endDate <= startDate) {
            throw new Error('End datetime must be after start datetime');
        }
        return true;
    }),
    (0, express_validator_1.body)('purpose')
        .optional()
        .isString()
        .withMessage('Purpose must be a string')
        .isLength({ max: 500 })
        .withMessage('Purpose must not exceed 500 characters'),
    (0, express_validator_1.body)('userId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
];
exports.updateReservationValidation = [
    (0, express_validator_1.body)('userName')
        .optional()
        .isString()
        .withMessage('User name must be a string')
        .isLength({ min: 2, max: 100 })
        .withMessage('User name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('userEmail')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('startDatetime')
        .optional()
        .isISO8601()
        .withMessage('Start datetime must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('endDatetime')
        .optional()
        .isISO8601()
        .withMessage('End datetime must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('bookingStatus')
        .optional()
        .isIn(['confirmed', 'cancelled', 'pending'])
        .withMessage('Booking status must be confirmed, cancelled, or pending'),
    (0, express_validator_1.body)('purpose')
        .optional()
        .isString()
        .withMessage('Purpose must be a string')
        .isLength({ max: 500 })
        .withMessage('Purpose must not exceed 500 characters')
];
exports.getReservationsValidation = [
    (0, express_validator_1.query)('roomNumber')
        .optional()
        .isString()
        .withMessage('Room number must be a string'),
    (0, express_validator_1.query)('userEmail')
        .optional()
        .isEmail()
        .withMessage('User email must be a valid email address'),
    (0, express_validator_1.query)('userId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['confirmed', 'cancelled', 'pending'])
        .withMessage('Status must be confirmed, cancelled, or pending')
];
