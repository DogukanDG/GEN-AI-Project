import { body, param } from 'express-validator';

export const createRoomFeatureValidation = [
  body('roomNumber')
    .notEmpty()
    .withMessage('Room number is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Room number must be between 1 and 50 characters')
    .trim(),
  body('floor')
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  body('roomType')
    .notEmpty()
    .withMessage('Room type is required')
    .isIn(['classroom', 'study_room', 'lab', 'office', 'meeting_room'])
    .withMessage('Room type must be one of: classroom, study_room, lab, office, meeting_room'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('areaSqm')
    .isFloat({ min: 0.1 })
    .withMessage('Area must be a positive number'),
  body('windowCount')
    .isInt({ min: 0 })
    .withMessage('Window count must be a non-negative integer'),
  body('hasNaturalLight')
    .isBoolean()
    .withMessage('Has natural light must be a boolean'),
  body('hasProjector')
    .isBoolean()
    .withMessage('Has projector must be a boolean'),
  body('hasMicrophone')
    .isBoolean()
    .withMessage('Has microphone must be a boolean'),
  body('hasCamera')
    .isBoolean()
    .withMessage('Has camera must be a boolean'),
  body('hasAirConditioner')
    .isBoolean()
    .withMessage('Has air conditioner must be a boolean'),
  body('hasNoiseCancelling')
    .isBoolean()
    .withMessage('Has noise cancelling must be a boolean'),
];

export const updateRoomFeatureValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid room feature ID is required'),
  body('roomNumber')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Room number must be between 1 and 50 characters')
    .trim(),
  body('floor')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  body('roomType')
    .optional()
    .isIn(['classroom', 'study_room', 'lab', 'office', 'meeting_room'])
    .withMessage('Room type must be one of: classroom, study_room, lab, office, meeting_room'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('areaSqm')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Area must be a positive number'),
  body('windowCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Window count must be a non-negative integer'),
  body('hasNaturalLight')
    .optional()
    .isBoolean()
    .withMessage('Has natural light must be a boolean'),
  body('hasProjector')
    .optional()
    .isBoolean()
    .withMessage('Has projector must be a boolean'),
  body('hasMicrophone')
    .optional()
    .isBoolean()
    .withMessage('Has microphone must be a boolean'),
  body('hasCamera')
    .optional()
    .isBoolean()
    .withMessage('Has camera must be a boolean'),
  body('hasAirConditioner')
    .optional()
    .isBoolean()
    .withMessage('Has air conditioner must be a boolean'),
  body('hasNoiseCancelling')
    .optional()
    .isBoolean()
    .withMessage('Has noise cancelling must be a boolean'),
];

export const getRoomFeatureValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid room feature ID is required'),
];

export const deleteRoomFeatureValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid room feature ID is required'),
];
