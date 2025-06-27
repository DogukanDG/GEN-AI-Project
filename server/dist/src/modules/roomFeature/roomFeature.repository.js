"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFeatureRepository = void 0;
const database_1 = __importDefault(require("../../configs/database"));
class RoomFeatureRepository {
    async create(userId, data) {
        return await database_1.default.roomFeature.create({
            data: {
                roomNumber: data.roomNumber,
                floor: data.floor,
                roomType: data.roomType,
                capacity: data.capacity,
                areaSqm: data.areaSqm,
                windowCount: data.windowCount,
                hasNaturalLight: data.hasNaturalLight,
                hasProjector: data.hasProjector,
                hasMicrophone: data.hasMicrophone,
                hasCamera: data.hasCamera,
                hasAirConditioner: data.hasAirConditioner,
                hasNoiseCancelling: data.hasNoiseCancelling,
                userId: userId,
            },
        });
    }
    async findById(id) {
        return await database_1.default.roomFeature.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId) {
        return await database_1.default.roomFeature.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll() {
        return await database_1.default.roomFeature.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, userId, data) {
        return await database_1.default.roomFeature.update({
            where: {
                id,
                ...(userId && { userId }), // Only filter by userId if provided
            },
            data,
        });
    }
    async delete(id, userId) {
        return await database_1.default.roomFeature.delete({
            where: {
                id,
                ...(userId && { userId }), // Only filter by userId if provided
            },
        });
    }
    async findByIdAndUserId(id, userId) {
        return await database_1.default.roomFeature.findFirst({
            where: {
                id,
                ...(userId && { userId }),
            },
        });
    }
}
exports.RoomFeatureRepository = RoomFeatureRepository;
