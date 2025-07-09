import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import * as authenticationController from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty(),
  ],
  validateRequest,
  authenticationController.login
);

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  validateRequest,
  authenticationController.register
);

export default router;
