"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomFeatureValidation = exports.getRoomFeatureValidation = exports.updateRoomFeatureValidation = exports.createRoomFeatureValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createRoomFeatureValidation = [
    (0, express_validator_1.body)('roomNumber')
        .notEmpty()
        .withMessage('Room number is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Room number must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('floor')
        .isInt({ min: 0 })
        .withMessage('Floor must be a non-negative integer'),
    (0, express_validator_1.body)('roomType')
        .notEmpty()
        .withMessage('Room type is required')
        .isIn(['classroom', 'study_room', 'lab', 'office', 'meeting_room'])
        .withMessage('Room type must be one of: classroom, study_room, lab, office, meeting_room'),
    (0, express_validator_1.body)('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be a positive integer'),
    (0, express_validator_1.body)('areaSqm')
        .isFloat({ min: 0.1 })
        .withMessage('Area must be a positive number'),
    (0, express_validator_1.body)('windowCount')
        .isInt({ min: 0 })
        .withMessage('Window count must be a non-negative integer'),
    (0, express_validator_1.body)('hasNaturalLight')
        .isBoolean()
        .withMessage('Has natural light must be a boolean'),
    (0, express_validator_1.body)('hasProjector')
        .isBoolean()
        .withMessage('Has projector must be a boolean'),
    (0, express_validator_1.body)('hasMicrophone')
        .isBoolean()
        .withMessage('Has microphone must be a boolean'),
    (0, express_validator_1.body)('hasCamera')
        .isBoolean()
        .withMessage('Has camera must be a boolean'),
    (0, express_validator_1.body)('hasAirConditioner')
        .isBoolean()
        .withMessage('Has air conditioner must be a boolean'),
    (0, express_validator_1.body)('hasNoiseCancelling')
        .isBoolean()
        .withMessage('Has noise cancelling must be a boolean'),
];
exports.updateRoomFeatureValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid room feature ID is required'),
    (0, express_validator_1.body)('roomNumber')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Room number must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('floor')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Floor must be a non-negative integer'),
    (0, express_validator_1.body)('roomType')
        .optional()
        .isIn(['classroom', 'study_room', 'lab', 'office', 'meeting_room'])
        .withMessage('Room type must be one of: classroom, study_room, lab, office, meeting_room'),
    (0, express_validator_1.body)('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Capacity must be a positive integer'),
    (0, express_validator_1.body)('areaSqm')
        .optional()
        .isFloat({ min: 0.1 })
        .withMessage('Area must be a positive number'),
    (0, express_validator_1.body)('windowCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Window count must be a non-negative integer'),
    (0, express_validator_1.body)('hasNaturalLight')
        .optional()
        .isBoolean()
        .withMessage('Has natural light must be a boolean'),
    (0, express_validator_1.body)('hasProjector')
        .optional()
        .isBoolean()
        .withMessage('Has projector must be a boolean'),
    (0, express_validator_1.body)('hasMicrophone')
        .optional()
        .isBoolean()
        .withMessage('Has microphone must be a boolean'),
    (0, express_validator_1.body)('hasCamera')
        .optional()
        .isBoolean()
        .withMessage('Has camera must be a boolean'),
    (0, express_validator_1.body)('hasAirConditioner')
        .optional()
        .isBoolean()
        .withMessage('Has air conditioner must be a boolean'),
    (0, express_validator_1.body)('hasNoiseCancelling')
        .optional()
        .isBoolean()
        .withMessage('Has noise cancelling must be a boolean'),
];
exports.getRoomFeatureValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid room feature ID is required'),
];
exports.deleteRoomFeatureValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid room feature ID is required'),
];
