import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import * as userController from './user.controller';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty().isLength({ min: 6 }),
  ],
  validateRequest,
  userController.signup
);

export default router;
