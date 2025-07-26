"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = __importDefault(require("./reservation.controller"));
const reservation_validation_1 = require("./reservation.validation");
const request_validator_middleware_1 = require("../../middlewares/request-validator.middleware");
const router = (0, express_1.Router)();
// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Reservation routes working!' });
});
// AI-powered room search
router.post('/search-ai', reservation_controller_1.default.searchRoomsWithAI);
// Check room availability
router.post('/check-availability', reservation_controller_1.default.checkRoomAvailability);
// Create a new reservation
router.post('/', reservation_validation_1.createReservationValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.createReservation);
// Get all reservations with optional filters
router.get('/', reservation_validation_1.getReservationsValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.getReservations);
// Get upcoming reservations
router.get('/upcoming', reservation_controller_1.default.getUpcomingReservations);
// Get user's reservations by email
router.get('/user/:email', reservation_controller_1.default.getUserReservations);
// Update a reservation
router.put('/:id', reservation_validation_1.updateReservationValidation, request_validator_middleware_1.validateRequest, reservation_controller_1.default.updateReservation);
// Cancel a reservation
router.patch('/:id/cancel', reservation_controller_1.default.cancelReservation);
// Get a specific reservation by ID (must be last due to /:id pattern)
router.get('/:id', reservation_controller_1.default.getReservationById);
// Delete a reservation
router.delete('/:id', reservation_controller_1.default.deleteReservation);
exports.default = router;
