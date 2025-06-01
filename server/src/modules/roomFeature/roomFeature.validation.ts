import { body, param } from 'express-validator';

export const createRoomFeatureValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be between 1 and 5000 characters')
    .trim(),
];

export const updateRoomFeatureValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid room feature ID is required'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be between 1 and 5000 characters')
    .trim(),
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
