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
        const roomExists = room.find((r) => r.roomNumber === data.roomNumber);
        if (!roomExists) {
            throw new errors_1.HttpError(404, "Room not found");
        }
        // Check room availability
        const isAvailable = await reservation_repository_1.default.checkRoomAvailability(data.roomNumber, data.startDatetime, data.endDatetime);
        if (!isAvailable) {
            throw new errors_1.HttpError(409, "Room is not available for the selected time slot");
        }
        // Create reservation
        const reservation = await reservation_repository_1.default.create(data);
        // Generate confirmation message
        try {
            const confirmationMessage = await gemini_service_1.default.generateBookingConfirmation(reservation);
            return {
                reservation,
                confirmationMessage,
            };
        }
        catch (error) {
            // Return reservation even if confirmation message generation fails
            return {
                reservation,
                confirmationMessage: "Your room has been successfully booked!",
            };
        }
    }
    async getReservations(query = {}) {
        return await reservation_repository_1.default.findMany(query);
    }
    async getReservationById(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, "Reservation not found");
        }
        return reservation;
    }
    async updateReservation(id, data) {
        const existingReservation = await reservation_repository_1.default.findById(id);
        if (!existingReservation) {
            throw new errors_1.HttpError(404, "Reservation not found");
        }
        // If updating time, check availability
        if (data.startDatetime || data.endDatetime) {
            const startTime = data.startDatetime || existingReservation.startDatetime;
            const endTime = data.endDatetime || existingReservation.endDatetime;
            const isAvailable = await reservation_repository_1.default.checkRoomAvailability(existingReservation.roomNumber, startTime, endTime, id);
            if (!isAvailable) {
                throw new errors_1.HttpError(409, "Room is not available for the selected time slot");
            }
        }
        return await reservation_repository_1.default.update(id, data);
    }
    async cancelReservation(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, "Reservation not found");
        }
        if (reservation.bookingStatus === "cancelled") {
            throw new errors_1.HttpError(400, "Reservation is already cancelled");
        }
        return await reservation_repository_1.default.update(id, {
            bookingStatus: "cancelled",
        });
    }
    async deleteReservation(id) {
        const reservation = await reservation_repository_1.default.findById(id);
        if (!reservation) {
            throw new errors_1.HttpError(404, "Reservation not found");
        }
        return await reservation_repository_1.default.delete(id);
    }
    async getUserReservations(userEmail) {
        return await reservation_repository_1.default.getUserReservations(userEmail);
    }
    async searchRoomsWithAI(userPrompt) {
        try {
            console.log("=== searchRoomsWithAI started ===");
            console.log("User prompt:", userPrompt);
            console.log("Current timestamp:", new Date().toISOString());
            // Ön kontrol: Prompt'un minimum uzunluğu kontrol et
            if (!userPrompt || userPrompt.trim().length < 3) {
                throw new errors_1.HttpError(400, "Please provide a more detailed room request");
            }
            // Basit keyword kontrolü (opsiyonel ek güvenlik)
            const roomKeywords = [
                "room",
                "oda",
                "book",
                "reserve",
                "reservation",
                "study",
                "meeting",
                "class",
                "classroom",
            ];
            const hasRoomKeyword = roomKeywords.some((keyword) => userPrompt.toLowerCase().includes(keyword));
            if (!hasRoomKeyword) {
                console.log("No room-related keywords found, proceeding with AI validation");
            }
            // Parse user requirements using Gemini AI (validasyon dahil)
            console.log("About to call geminiService.parseRoomRequest...");
            let requirements;
            try {
                requirements = await gemini_service_1.default.parseRoomRequest(userPrompt);
                console.log("Successfully received requirements from Gemini:", JSON.stringify(requirements, null, 2));
            }
            catch (error) {
                console.error("Gemini parsing error:", error);
                // Hata mesajını kontrol et ve kullanıcıya anlamlı mesaj döndür
                if (error instanceof Error) {
                    if (error.message.includes("Invalid room booking request")) {
                        throw new errors_1.HttpError(400, "Your request does not appear to be related to room booking. Please provide a valid room reservation request.");
                    }
                    if (error.message.includes("No valid room requirements found")) {
                        throw new errors_1.HttpError(400, "Could not understand your room requirements. Please provide more specific details about the room you need.");
                    }
                }
                throw new errors_1.HttpError(400, "Unable to process your room request. Please try rephrasing your request with clear room booking details.");
            }
            // Get available rooms from database
            console.log("Fetching available rooms...");
            const availableRooms = await roomFeatureRepository.findAll();
            console.log("Available rooms count:", availableRooms.length);
            if (availableRooms.length === 0) {
                throw new errors_1.HttpError(404, "No rooms available");
            }
            // Filter rooms based on basic requirements first
            let filteredRooms = availableRooms;
            console.log("Starting room filtering...");
            // Filter by capacity
            if (requirements.capacity) {
                console.log("Filtering by capacity:", requirements.capacity);
                filteredRooms = filteredRooms.filter((room) => room.capacity >= requirements.capacity);
                console.log("Rooms after capacity filter:", filteredRooms.length);
            }
            // Filter by room type
            if (requirements.roomType) {
                console.log("Filtering by room type:", requirements.roomType);
                filteredRooms = filteredRooms.filter((room) => room.roomType === requirements.roomType);
                console.log("Rooms after room type filter:", filteredRooms.length);
            }
            // Filter by required features (sadece true olanlar için filtrele)
            if (requirements.hasProjector === true) {
                console.log("Filtering by projector requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasProjector);
                console.log("Rooms after projector filter:", filteredRooms.length);
            }
            if (requirements.hasAirConditioner === true) {
                console.log("Filtering by air conditioner requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasAirConditioner);
                console.log("Rooms after air conditioner filter:", filteredRooms.length);
            }
            if (requirements.hasMicrophone === true) {
                console.log("Filtering by microphone requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasMicrophone);
                console.log("Rooms after microphone filter:", filteredRooms.length);
            }
            if (requirements.hasCamera === true) {
                console.log("Filtering by camera requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasCamera);
                console.log("Rooms after camera filter:", filteredRooms.length);
            }
            if (requirements.hasNoiseCancelling === true) {
                console.log("Filtering by noise cancelling requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasNoiseCancelling);
                console.log("Rooms after noise cancelling filter:", filteredRooms.length);
            }
            if (requirements.hasNaturalLight === true) {
                console.log("Filtering by natural light requirement");
                filteredRooms = filteredRooms.filter((room) => room.hasNaturalLight);
                console.log("Rooms after natural light filter:", filteredRooms.length);
            }
            if (filteredRooms.length === 0) {
                return {
                    requirements,
                    rooms: [],
                    message: "No rooms match your requirements. Please try adjusting your criteria.",
                };
            }
            // Use Gemini AI to rank the filtered rooms
            console.log("Ranking rooms with Gemini AI...");
            const rankedRooms = await gemini_service_1.default.rankRooms(requirements, filteredRooms);
            console.log("Ranking complete. Rooms ranked:", rankedRooms.length);
            return {
                requirements,
                rooms: rankedRooms,
                message: `Found ${rankedRooms.length} rooms matching your criteria.`,
            };
        }
        catch (error) {
            console.error("Error in AI room search:", error);
            // HttpError'ları olduğu gibi geçir
            if (error instanceof errors_1.HttpError) {
                throw error;
            }
            // Diğer hatalar için genel mesaj
            throw new errors_1.HttpError(500, "Failed to search rooms. Please try again.");
        }
    }
    async getUpcomingReservations(limit = 10) {
        return await reservation_repository_1.default.getUpcomingReservations(limit);
    }
    async checkRoomAvailability(roomNumber, startDatetime, endDatetime) {
        return await reservation_repository_1.default.checkRoomAvailability(roomNumber, startDatetime, endDatetime);
    }
    async getReservedSlots(roomNumber, date) {
        return await reservation_repository_1.default.getReservedSlots(roomNumber, date);
    }
}
exports.ReservationService = ReservationService;
exports.default = new ReservationService();
