"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFeatureService = void 0;
const roomFeature_repository_1 = require("./roomFeature.repository");
const errors_1 = require("../../types/errors");
class RoomFeatureService {
    roomFeatureRepository;
    constructor() {
        this.roomFeatureRepository = new roomFeature_repository_1.RoomFeatureRepository();
    }
    async createRoomFeature(userId, data) {
        if (!data.roomNumber || data.roomNumber.trim().length === 0) {
            throw new errors_1.BadRequestError('Room number is required');
        }
        if (!data.roomType || data.roomType.trim().length === 0) {
            throw new errors_1.BadRequestError('Room type is required');
        }
        if (data.capacity <= 0) {
            throw new errors_1.BadRequestError('Capacity must be greater than 0');
        }
        if (data.areaSqm <= 0) {
            throw new errors_1.BadRequestError('Area must be greater than 0');
        }
        const roomFeature = await this.roomFeatureRepository.create(userId, {
            roomNumber: data.roomNumber.trim(),
            floor: data.floor,
            roomType: data.roomType.trim(),
            capacity: data.capacity,
            areaSqm: data.areaSqm,
            windowCount: data.windowCount,
            hasNaturalLight: data.hasNaturalLight,
            hasProjector: data.hasProjector,
            hasMicrophone: data.hasMicrophone,
            hasCamera: data.hasCamera,
            hasAirConditioner: data.hasAirConditioner,
            hasNoiseCancelling: data.hasNoiseCancelling,
        });
        return roomFeature;
    }
    async getRoomFeatureById(id) {
        const roomFeature = await this.roomFeatureRepository.findById(id);
        if (!roomFeature) {
            throw new errors_1.NotFoundError('Room feature not found');
        }
        return roomFeature;
    }
    async getUserRoomFeatures(userId) {
        return await this.roomFeatureRepository.findByUserId(userId);
    }
    async getAllRoomFeatures() {
        return await this.roomFeatureRepository.findAll();
    }
    async updateRoomFeature(id, userId, data) {
        // Check if room feature exists and belongs to user
        const existingRoomFeature = await this.roomFeatureRepository.findByIdAndUserId(id, userId);
        if (!existingRoomFeature) {
            throw new errors_1.NotFoundError('Room feature not found or you do not have permission to update it');
        }
        // Validate data
        if (data.roomNumber !== undefined && data.roomNumber.trim().length === 0) {
            throw new errors_1.BadRequestError('Room number cannot be empty');
        }
        if (data.roomType !== undefined && data.roomType.trim().length === 0) {
            throw new errors_1.BadRequestError('Room type cannot be empty');
        }
        if (data.capacity !== undefined && data.capacity <= 0) {
            throw new errors_1.BadRequestError('Capacity must be greater than 0');
        }
        if (data.areaSqm !== undefined && data.areaSqm <= 0) {
            throw new errors_1.BadRequestError('Area must be greater than 0');
        }
        // Prepare update data
        const updateData = {};
        if (data.roomNumber !== undefined) {
            updateData.roomNumber = data.roomNumber.trim();
        }
        if (data.roomType !== undefined) {
            updateData.roomType = data.roomType.trim();
        }
        if (data.floor !== undefined) {
            updateData.floor = data.floor;
        }
        if (data.capacity !== undefined) {
            updateData.capacity = data.capacity;
        }
        if (data.areaSqm !== undefined) {
            updateData.areaSqm = data.areaSqm;
        }
        if (data.windowCount !== undefined) {
            updateData.windowCount = data.windowCount;
        }
        if (data.hasNaturalLight !== undefined) {
            updateData.hasNaturalLight = data.hasNaturalLight;
        }
        if (data.hasProjector !== undefined) {
            updateData.hasProjector = data.hasProjector;
        }
        if (data.hasMicrophone !== undefined) {
            updateData.hasMicrophone = data.hasMicrophone;
        }
        if (data.hasCamera !== undefined) {
            updateData.hasCamera = data.hasCamera;
        }
        if (data.hasAirConditioner !== undefined) {
            updateData.hasAirConditioner = data.hasAirConditioner;
        }
        if (data.hasNoiseCancelling !== undefined) {
            updateData.hasNoiseCancelling = data.hasNoiseCancelling;
        }
        return await this.roomFeatureRepository.update(id, userId, updateData);
    }
    async deleteRoomFeature(id, userId) {
        // Check if room feature exists and belongs to user
        const existingRoomFeature = await this.roomFeatureRepository.findByIdAndUserId(id, userId);
        if (!existingRoomFeature) {
            throw new errors_1.NotFoundError('Room feature not found or you do not have permission to delete it');
        }
        await this.roomFeatureRepository.delete(id, userId);
    }
}
exports.RoomFeatureService = RoomFeatureService;
