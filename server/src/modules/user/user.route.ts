import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import * as userController from './user.controller';
import { requireAdmin } from '../../middlewares/role-authorization.middleware';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty().isLength({ min: 6 }),
    body('role')
      .optional()
      .isIn(['normal', 'admin'])
      .withMessage('Role must be either "normal" or "admin"'),
  ],
  validateRequest,
  userController.signup
);

router.get('/', authorizeUser, requireAdmin, userController.getAllUsers);
router.get('/:id', authorizeUser, requireAdmin, userController.getUserById);
router.put('/:id', authorizeUser, requireAdmin, userController.updateUser);
router.delete('/:id', authorizeUser, requireAdmin, userController.deleteUser);

export default router;
