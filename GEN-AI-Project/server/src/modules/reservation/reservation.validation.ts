import { body, query } from 'express-validator';

export const createReservationValidation = [
  body('roomNumber')
    .notEmpty()
    .withMessage('Room number is required')
    .isString()
    .withMessage('Room number must be a string'),
    
  body('userName')
    .notEmpty()
    .withMessage('User name is required')
    .isString()
    .withMessage('User name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('User name must be between 2 and 100 characters'),
    
  body('userEmail')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('startDatetime')
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
    
  body('endDatetime')
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
    
  body('purpose')
    .optional()
    .isString()
    .withMessage('Purpose must be a string')
    .isLength({ max: 500 })
    .withMessage('Purpose must not exceed 500 characters'),
    
  body('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer')
];

export const updateReservationValidation = [
  body('userName')
    .optional()
    .isString()
    .withMessage('User name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('User name must be between 2 and 100 characters'),
    
  body('userEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('startDatetime')
    .optional()
    .isISO8601()
    .withMessage('Start datetime must be a valid ISO 8601 date'),
    
  body('endDatetime')
    .optional()
    .isISO8601()
    .withMessage('End datetime must be a valid ISO 8601 date'),
    
  body('bookingStatus')
    .optional()
    .isIn(['confirmed', 'cancelled', 'pending'])
    .withMessage('Booking status must be confirmed, cancelled, or pending'),
    
  body('purpose')
    .optional()
    .isString()
    .withMessage('Purpose must be a string')
    .isLength({ max: 500 })
    .withMessage('Purpose must not exceed 500 characters')
];

export const getReservationsValidation = [
  query('roomNumber')
    .optional()
    .isString()
    .withMessage('Room number must be a string'),
    
  query('userEmail')
    .optional()
    .isEmail()
    .withMessage('User email must be a valid email address'),
    
  query('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
    
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
    
  query('status')
    .optional()
    .isIn(['confirmed', 'cancelled', 'pending'])
    .withMessage('Status must be confirmed, cancelled, or pending')
];
