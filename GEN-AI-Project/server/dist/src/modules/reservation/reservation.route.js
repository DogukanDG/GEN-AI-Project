"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = __importDefault(require("./reservation.controller"));
const reservation_validation_1 = require("./reservation.validation");
const request_validator_middleware_1 = require("../../middlewares/request-validator.middleware");
const rate_limiter_middleware_1 = require("../../middlewares/rate-limiter.middleware");
const router = (0, express_1.Router)();
// Apply general rate limiting to all reservation routes
router.use(rate_limiter_middleware_1.apiLimiter);
// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Reservation routes working!' });
});
// AI-powered room search - with stricter rate limiting
router.post('/search-ai', rate_limiter_middleware_1.searchLimiter, reservation_controller_1.default.searchRoomsWithAI);
// Check room availability - with reservation rate limiting
router.post('/check-availability', rate_limiter_middleware_1.reservationLimiter, reservation_controller_1.default.checkRoomAvailability);
// Get reserved time slots for a room on a specific date - with reservation rate limiting
router.get('/reserved-slots', rate_limiter_middleware_1.reservationLimiter, reservation_controller_1.default.getReservedSlots);
// Get upcoming reservations
router.get('/upcoming', reservation_controller_1.default.getUpcomingReservations);
// Get user's reservations by email
router.get('/user/:email', reservation_controller_1.default.getUserReservations);
// Get all reservations with optional filters
router.get('/', reservation_validation_1.getReservationsValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.getReservations);
// Create a new reservation - with reservation rate limiting
router.post('/', rate_limiter_middleware_1.reservationLimiter, reservation_validation_1.createReservationValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.createReservation);
// Update a reservation - with reservation rate limiting
router.put('/:id', rate_limiter_middleware_1.reservationLimiter, reservation_validation_1.updateReservationValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.updateReservation);
// Cancel a reservation - with reservation rate limiting
router.patch('/:id/cancel', rate_limiter_middleware_1.reservationLimiter, reservation_controller_1.default.cancelReservation);
// Get a specific reservation by ID (must be last due to /:id pattern)
router.get('/:id', reservation_controller_1.default.getReservationById);
// Delete a reservation
router.delete('/:id', reservation_controller_1.default.deleteReservation);
exports.default = router;
