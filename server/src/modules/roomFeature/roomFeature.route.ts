import { Router } from 'express';
import { RoomFeatureController } from './roomFeature.controller';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';
import {
  requireAdmin,
  setUserRole,
} from '../../middlewares/role-authorization.middleware';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import {
  createRoomFeatureValidation,
  updateRoomFeatureValidation,
  getRoomFeatureValidation,
  deleteRoomFeatureValidation,
} from './roomFeature.validation';

const router = Router();
const roomFeatureController = new RoomFeatureController();

// Create a new room feature (Admin only)
router.post(
  '/',
  authorizeUser,
  requireAdmin,
  createRoomFeatureValidation,
  validateRequest,
  roomFeatureController.createRoomFeature
);

// Get all room features for current user (Protected)
router.get(
  '/my-room-features',
  authorizeUser,
  setUserRole,
  roomFeatureController.getUserRoomFeatures
);

// Get all room features (Admin only)
router.get(
  '/all',
  authorizeUser,
  requireAdmin,
  roomFeatureController.getAllRoomFeatures
);

// Room CRUD (Admin only)
router.get(
  '/rooms',
  authorizeUser,
  requireAdmin,
  roomFeatureController.getAllRooms
);
router.get(
  '/rooms/:id',
  authorizeUser,
  requireAdmin,
  roomFeatureController.getRoomById
);
router.post(
  '/rooms',
  authorizeUser,
  requireAdmin,
  createRoomFeatureValidation,
  validateRequest,
  roomFeatureController.createRoom
);
router.put(
  '/rooms/:id',
  authorizeUser,
  requireAdmin,
  updateRoomFeatureValidation,
  validateRequest,
  roomFeatureController.updateRoom
);
router.delete(
  '/rooms/:id',
  authorizeUser,
  requireAdmin,
  roomFeatureController.deleteRoom
);

// Get room feature by ID (Admin only)
router.get(
  '/:id',
  authorizeUser,
  requireAdmin,
  getRoomFeatureValidation,
  validateRequest,
  roomFeatureController.getRoomFeatureById
);

// Update room feature (Admin only)
router.put(
  '/:id',
  authorizeUser,
  requireAdmin,
  updateRoomFeatureValidation,
  validateRequest,
  roomFeatureController.updateRoomFeature
);

// Delete room feature (Admin only)
router.delete(
  '/:id',
  authorizeUser,
  requireAdmin,
  deleteRoomFeatureValidation,
  validateRequest,
  roomFeatureController.deleteRoomFeature
);

export default router;
