import { Router } from 'express';
import reservationController from './reservation.controller';
import { 
  createReservationValidation, 
  updateReservationValidation, 
  getReservationsValidation 
} from './reservation.validation';
import { validateRequest } from '../../middlewares/request-validator.middleware';

const router = Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Reservation routes working!' });
});

// AI-powered room search
router.post('/search-ai', reservationController.searchRoomsWithAI);

// Check room availability
router.post('/check-availability', reservationController.checkRoomAvailability);

// Get upcoming reservations
router.get('/upcoming', reservationController.getUpcomingReservations);

// Get user's reservations by email
router.get('/user/:email', reservationController.getUserReservations);

// Get all reservations with optional filters
router.get('/', getReservationsValidation, validateRequest, reservationController.getReservations);

// Create a new reservation
router.post('/', createReservationValidation, validateRequest, reservationController.createReservation);

// Update a reservation
router.put('/:id', updateReservationValidation, validateRequest, reservationController.updateReservation);

// Cancel a reservation
router.patch('/:id/cancel', reservationController.cancelReservation);

// Get a specific reservation by ID (must be last due to /:id pattern)
router.get('/:id', reservationController.getReservationById);

// Delete a reservation
router.delete('/:id', reservationController.deleteReservation);

export default router;
