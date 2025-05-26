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

export default router;
