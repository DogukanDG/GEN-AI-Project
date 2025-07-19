import { Router } from 'express';
import reservationController from './reservation.controller';
import {
  createReservationValidation,
  updateReservationValidation,
  getReservationsValidation,
} from './reservation.validation';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import { requireAdmin } from '../../middlewares/role-authorization.middleware';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';
import { apiLimiter, searchLimiter, reservationLimiter } from '../../middlewares/rate-limiter.middleware';

const router = Router();

router.use(apiLimiter);
// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Reservation routes working!' });
});

// AI-powered room search - with stricter rate limiting
router.post('/search-ai', searchLimiter, reservationController.searchRoomsWithAI);

// Check room availability - with reservation rate limiting
router.post('/check-availability', reservationLimiter, reservationController.checkRoomAvailability);

// Get reserved time slots for a room on a specific date - with reservation rate limiting
router.get('/reserved-slots', reservationLimiter, reservationController.getReservedSlots);

// Get upcoming reservations
router.get('/upcoming', reservationController.getUpcomingReservations);

// Get user's reservations by email
router.get('/user/:email', reservationController.getUserReservations);

// Get all reservations with optional filters
router.get(
  '/',
  authorizeUser,
  getReservationsValidation,
  validateRequest,
  reservationController.getReservations
);

// Create a new reservation
router.post(
  '/',
  authorizeUser,
  reservationLimiter,
  createReservationValidation,
  validateRequest,
  reservationController.createReservation
);

// Update a reservation
router.put(
  '/:id',
  authorizeUser,
  reservationLimiter,
  updateReservationValidation,
  validateRequest,
  reservationController.updateReservation
);

// Cancel a reservation
router.patch('/:id/cancel', reservationLimiter,reservationController.cancelReservation);

// Get a specific reservation by ID (must be last due to /:id pattern)
router.get('/:id', reservationController.getReservationById);

// Delete a reservation
router.delete(
  '/:id',
  authorizeUser,
  reservationController.deleteReservation
);

export default router;
