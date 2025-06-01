import { Router } from 'express';
import { RoomFeatureController } from './roomFeature.controller';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import {
  createRoomFeatureValidation,
  updateRoomFeatureValidation,
  getRoomFeatureValidation,
  deleteRoomFeatureValidation,
} from './roomFeature.validation';

const router = Router();
const roomFeatureController = new RoomFeatureController();

// Create a new room feature (Protected)
router.post(
  '/',
  authorizeUser,
  createRoomFeatureValidation,
  validateRequest,
  roomFeatureController.createRoomFeature
);

// Get all room features for current user (Protected)
router.get(
  '/my-room-features',
  authorizeUser,
  roomFeatureController.getUserRoomFeatures
);

// Get all room features (Protected)
router.get(
  '/all',
  authorizeUser,
  roomFeatureController.getAllRoomFeatures
);

// Get room feature by ID (Protected)
router.get(
  '/:id',
  authorizeUser,
  getRoomFeatureValidation,
  validateRequest,
  roomFeatureController.getRoomFeatureById
);

// Update room feature (Protected - only owner can update)
router.put(
  '/:id',
  authorizeUser,
  updateRoomFeatureValidation,
  validateRequest,
  roomFeatureController.updateRoomFeature
);

// Delete room feature (Protected - only owner can delete)
router.delete(
  '/:id',
  authorizeUser,
  deleteRoomFeatureValidation,
  validateRequest,
  roomFeatureController.deleteRoomFeature
);

export default router;
