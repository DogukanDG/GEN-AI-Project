"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const reservation_repository_1 = __importDefault(require("./reservation.repository"));
const gemini_service_1 = __importDefault(require("../../services/gemini.service"));
const errors_1 = require("../../types/errors");
const roomFeature_repository_1 = require("../roomFeature/roomFeature.repository");
const roomFeatureRepository = new roomFeature_repository_1.RoomFeatureRepository();
class ReservationService {
    async createReservation(data) {
        // Check if room exists
        const room = await roomFeatureRepository.findAll();
        const roomExists = room.find(r => r.roomNumber === data.roomNumber);
        if (!roomExists) {
            throw new errors_1.HttpError(404, 'Room not found');
        }
        // Check room availability
        const isAvailable = await reservation_repository_1.default.checkRoomAvailability(data.roomNumber, data.startDatetime, data.endDatetime);
        if (!isAvailable) {
            throw new errors_1.HttpError(409, 'Room is not available for the selected time slot');
        }
        // Create reservation
        const reservation = await reservation_repository_1.default.create(data);
        // Generate confirmation message
        try {
            const confirmationMessage = await gemini_service_1.default.generateBookingConfirmation(reservation);
            return {
                reservation,
                confirmationMessage
            };
        }
        catch (error) {
            // Return reservation even if confirmation message generation fails
            return {
                reservation,
                confirmationMessage: 'Your room has been successfully booked!'
            };
        }
    }
    async getReservations(query = {}) {
        return await reservation_repository_1.default.findMany(query);
    }
    async getReservationById(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, 'Reservation not found');
        }
        return reservation;
    }
    async updateReservation(id, data) {
        const existingReservation = await reservation_repository_1.default.findById(id);
        if (!existingReservation) {
            throw new errors_1.HttpError(404, 'Reservation not found');
        }
        // If updating time, check availability
        if (data.startDatetime || data.endDatetime) {
            const startTime = data.startDatetime || existingReservation.startDatetime;
            const endTime = data.endDatetime || existingReservation.endDatetime;
            const isAvailable = await reservation_repository_1.default.checkRoomAvailability(existingReservation.roomNumber, startTime, endTime, id);
            if (!isAvailable) {
                throw new errors_1.HttpError(409, 'Room is not available for the selected time slot');
            }
        }
        return await reservation_repository_1.default.update(id, data);
    }
    async cancelReservation(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, 'Reservation not found');
        }
        if (reservation.bookingStatus === 'cancelled') {
            throw new errors_1.HttpError(400, 'Reservation is already cancelled');
        }
        return await reservation_repository_1.default.update(id, { bookingStatus: 'cancelled' });
    }
    async deleteReservation(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, 'Reservation not found');
        }
        return await reservation_repository_1.default.delete(id);
    }
    async getUserReservations(userEmail) {
        return await reservation_repository_1.default.getUserReservations(userEmail);
    }
    async searchRoomsWithAI(userPrompt) {
        try {
            // Parse user requirements using Gemini AI
            const requirements = await gemini_service_1.default.parseRoomRequest(userPrompt);
            // Get available rooms from database
            const availableRooms = await roomFeatureRepository.findAll();
            if (availableRooms.length === 0) {
                throw new errors_1.HttpError(404, 'No rooms available');
            }
            // Filter rooms based on basic requirements first
            let filteredRooms = availableRooms;
            // Filter by capacity
            if (requirements.capacity) {
                filteredRooms = filteredRooms.filter((room) => room.capacity >= requirements.capacity);
            }
            // Filter by room type
            if (requirements.roomType) {
                filteredRooms = filteredRooms.filter((room) => room.roomType === requirements.roomType);
            }
            // Filter by required features
            if (requirements.hasProjector === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasProjector);
            }
            if (requirements.hasAirConditioner === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasAirConditioner);
            }
            if (requirements.hasMicrophone === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasMicrophone);
            }
            if (requirements.hasCamera === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasCamera);
            }
            if (requirements.hasNoiseCancelling === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasNoiseCancelling);
            }
            if (requirements.hasNaturalLight === true) {
                filteredRooms = filteredRooms.filter((room) => room.hasNaturalLight);
            }
            if (filteredRooms.length === 0) {
                return {
                    requirements,
                    rooms: [],
                    message: 'No rooms match your requirements. Please try adjusting your criteria.'
                };
            }
            // Use Gemini AI to rank the filtered rooms
            const rankedRooms = await gemini_service_1.default.rankRooms(requirements, filteredRooms);
            return {
                requirements,
                rooms: rankedRooms,
                message: `Found ${rankedRooms.length} rooms matching your criteria.`
            };
        }
        catch (error) {
            console.error('Error in AI room search:', error);
            throw new errors_1.HttpError(500, 'Failed to search rooms with AI');
        }
    }
    async getUpcomingReservations(limit = 10) {
        return await reservation_repository_1.default.getUpcomingReservations(limit);
    }
    async checkRoomAvailability(roomNumber, startDatetime, endDatetime) {
        return await reservation_repository_1.default.checkRoomAvailability(roomNumber, startDatetime, endDatetime);
    }
}
exports.ReservationService = ReservationService;
exports.default = new ReservationService();
