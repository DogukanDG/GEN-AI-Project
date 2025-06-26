"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFeatureController = void 0;
const roomFeature_service_1 = require("./roomFeature.service");
class RoomFeatureController {
    roomFeatureService;
    constructor() {
        this.roomFeatureService = new roomFeature_service_1.RoomFeatureService();
    }
    createRoomFeature = async (req, res) => {
        try {
            const user = req.user;
            const { roomNumber, floor, roomType, capacity, areaSqm, windowCount, hasNaturalLight, hasProjector, hasMicrophone, hasCamera, hasAirConditioner, hasNoiseCancelling, } = req.body;
            const roomFeature = await this.roomFeatureService.createRoomFeature(user.id, {
                roomNumber,
                floor,
                roomType,
                capacity,
                areaSqm,
                windowCount,
                hasNaturalLight,
                hasProjector,
                hasMicrophone,
                hasCamera,
                hasAirConditioner,
                hasNoiseCancelling,
            });
            res.status(201).json({
                success: true,
                message: 'Room feature created successfully',
                data: roomFeature,
            });
        }
        catch (error) {
            throw error;
        }
    };
    getRoomFeatureById = async (req, res) => {
        try {
            const { id } = req.params;
            const roomFeature = await this.roomFeatureService.getRoomFeatureById(parseInt(id));
            res.status(200).json({
                success: true,
                data: roomFeature,
            });
        }
        catch (error) {
            throw error;
        }
    };
    getUserRoomFeatures = async (req, res) => {
        try {
            const user = req.user;
            const roomFeatures = await this.roomFeatureService.getUserRoomFeatures(user.id);
            res.status(200).json({
                success: true,
                data: roomFeatures,
                count: roomFeatures.length,
            });
        }
        catch (error) {
            throw error;
        }
    };
    getAllRoomFeatures = async (req, res) => {
        try {
            const roomFeatures = await this.roomFeatureService.getAllRoomFeatures();
            res.status(200).json({
                success: true,
                data: roomFeatures,
                count: roomFeatures.length,
            });
        }
        catch (error) {
            throw error;
        }
    };
    updateRoomFeature = async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.params;
            const { roomNumber, floor, roomType, capacity, areaSqm, windowCount, hasNaturalLight, hasProjector, hasMicrophone, hasCamera, hasAirConditioner, hasNoiseCancelling, } = req.body;
            const roomFeature = await this.roomFeatureService.updateRoomFeature(parseInt(id), user.id, {
                roomNumber,
                floor,
                roomType,
                capacity,
                areaSqm,
                windowCount,
                hasNaturalLight,
                hasProjector,
                hasMicrophone,
                hasCamera,
                hasAirConditioner,
                hasNoiseCancelling,
            });
            res.status(200).json({
                success: true,
                message: 'Room feature updated successfully',
                data: roomFeature,
            });
        }
        catch (error) {
            throw error;
        }
    };
    deleteRoomFeature = async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.params;
            await this.roomFeatureService.deleteRoomFeature(parseInt(id), user.id);
            res.status(200).json({
                success: true,
                message: 'Room feature deleted successfully',
            });
        }
        catch (error) {
            throw error;
        }
    };
}
exports.RoomFeatureController = RoomFeatureController;
