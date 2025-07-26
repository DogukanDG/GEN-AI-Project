"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const express_validator_1 = require("express-validator");
const reservation_service_1 = __importDefault(require("./reservation.service"));
const errors_1 = require("../../types/errors");
class ReservationController {
    async createReservation(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                next(new errors_1.HttpBodyValidationError(400, errors.array()));
                return;
            }
            const reservationData = {
                roomNumber: req.body.roomNumber,
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                startDatetime: new Date(req.body.startDatetime),
                endDatetime: new Date(req.body.endDatetime),
                purpose: req.body.purpose,
                userId: req.body.userId
            };
            const result = await reservation_service_1.default.createReservation(reservationData);
            res.status(201).json({
                success: true,
                message: 'Reservation created successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getReservations(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                next(new errors_1.HttpBodyValidationError(400, errors.array()));
                return;
            }
            const query = {
                roomNumber: req.query.roomNumber,
                userEmail: req.query.userEmail,
                userId: req.query.userId ? parseInt(req.query.userId) : undefined,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                status: req.query.status
            };
            const reservations = await reservation_service_1.default.getReservations(query);
            res.status(200).json({
                success: true,
                message: 'Reservations retrieved successfully',
                data: reservations,
                count: reservations.length
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getReservationById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid reservation ID'
                });
                return;
            }
            const reservation = await reservation_service_1.default.getReservationById(id);
            res.status(200).json({
                success: true,
                message: 'Reservation retrieved successfully',
                data: reservation
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateReservation(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                next(new errors_1.HttpBodyValidationError(400, errors.array()));
                return;
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid reservation ID'
                });
                return;
            }
            const updateData = {};
            if (req.body.userName)
                updateData.userName = req.body.userName;
            if (req.body.userEmail)
                updateData.userEmail = req.body.userEmail;
            if (req.body.startDatetime)
                updateData.startDatetime = new Date(req.body.startDatetime);
            if (req.body.endDatetime)
                updateData.endDatetime = new Date(req.body.endDatetime);
            if (req.body.bookingStatus)
                updateData.bookingStatus = req.body.bookingStatus;
            if (req.body.purpose)
                updateData.purpose = req.body.purpose;
            const reservation = await reservation_service_1.default.updateReservation(id, updateData);
            res.status(200).json({
                success: true,
                message: 'Reservation updated successfully',
                data: reservation
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cancelReservation(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid reservation ID'
                });
                return;
            }
            const reservation = await reservation_service_1.default.cancelReservation(id);
            res.status(200).json({
                success: true,
                message: 'Reservation cancelled successfully',
                data: reservation
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteReservation(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid reservation ID'
                });
                return;
            }
            await reservation_service_1.default.deleteReservation(id);
            res.status(200).json({
                success: true,
                message: 'Reservation deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserReservations(req, res, next) {
        try {
            const userEmail = req.params.email;
            if (!userEmail) {
                res.status(400).json({
                    success: false,
                    message: 'User email is required'
                });
                return;
            }
            const reservations = await reservation_service_1.default.getUserReservations(userEmail);
            res.status(200).json({
                success: true,
                message: 'User reservations retrieved successfully',
                data: reservations,
                count: reservations.length
            });
        }
        catch (error) {
            next(error);
        }
    }
    async searchRoomsWithAI(req, res, next) {
        try {
            console.log('searchRoomsWithAI called with body:', req.body);
            const { prompt } = req.body;
            if (!prompt || typeof prompt !== 'string') {
                console.log('Invalid prompt:', prompt);
                res.status(400).json({
                    success: false,
                    message: 'Prompt is required and must be a string'
                });
                return;
            }
            console.log('Calling reservationService.searchRoomsWithAI with prompt:', prompt);
            const result = await reservation_service_1.default.searchRoomsWithAI(prompt);
            console.log('Search result:', result);
            res.status(200).json({
                success: true,
                message: 'Room search completed successfully',
                data: result
            });
        }
        catch (error) {
            console.error('Error in searchRoomsWithAI:', error);
            next(error);
        }
    }
    async checkRoomAvailability(req, res, next) {
        try {
            const { roomNumber, startDatetime, endDatetime } = req.body;
            if (!roomNumber || !startDatetime || !endDatetime) {
                res.status(400).json({
                    success: false,
                    message: 'Room number, start datetime, and end datetime are required'
                });
                return;
            }
            const isAvailable = await reservation_service_1.default.checkRoomAvailability(roomNumber, new Date(startDatetime), new Date(endDatetime));
            res.status(200).json({
                success: true,
                message: 'Room availability checked successfully',
                data: {
                    roomNumber,
                    startDatetime,
                    endDatetime,
                    isAvailable
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUpcomingReservations(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const reservations = await reservation_service_1.default.getUpcomingReservations(limit);
            res.status(200).json({
                success: true,
                message: 'Upcoming reservations retrieved successfully',
                data: reservations,
                count: reservations.length
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getReservedSlots(req, res, next) {
        try {
            const { roomNumber, date } = req.query;
            if (!roomNumber || !date) {
                res.status(400).json({
                    success: false,
                    message: 'Room number and date are required'
                });
                return;
            }
            const reservedSlots = await reservation_service_1.default.getReservedSlots(roomNumber, date);
            res.status(200).json({
                success: true,
                message: 'Reserved slots retrieved successfully',
                data: reservedSlots
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReservationController = ReservationController;
exports.default = new ReservationController();
