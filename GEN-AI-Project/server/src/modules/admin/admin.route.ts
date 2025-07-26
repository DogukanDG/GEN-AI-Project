import { Router } from 'express';
import adminController from './admin.controller';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';
import { requireAdmin } from '../../middlewares/role-authorization.middleware';
import { adminLimiter } from '../../middlewares/rate-limiter.middleware';

const router = Router();

// Apply rate limiting to admin routes
router.use(adminLimiter);

// Apply admin authentication to all routes
router.use(authorizeUser);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);

// Tables overview
router.get('/tables', adminController.getTables);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Reservation management
router.get('/reservations', adminController.getReservations);
router.post('/reservations', adminController.createReservation);
router.put('/reservations/:id', adminController.updateReservation);
router.delete('/reservations/:id', adminController.deleteReservation);

// Room features management
router.get('/room-features', adminController.getRoomFeatures);
router.post('/room-features', adminController.createRoomFeature);
router.put('/room-features/:id', adminController.updateRoomFeature);
router.delete('/room-features/:id', adminController.deleteRoomFeature);

export default router;
