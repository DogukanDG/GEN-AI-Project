"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
const roomService = __importStar(require("./room.service"));
async function createRoom(req, res, next) {
    const { room_number, floor, room_type, capacity, area_sqm, chair_count, window_count, has_natural_light, has_projector, has_microphone, has_camera, has_air_conditioner, has_noise_cancelling, } = req.body;
    try {
        const newRoom = await roomService.createRoom({
            roomNumber: room_number,
            floor: Number(floor),
            roomType: room_type,
            capacity: Number(capacity),
            areaSqm: Number(area_sqm),
            windowCount: Number(window_count),
            hasNaturalLight: has_natural_light === 'true',
            hasProjector: has_projector === 'true',
            hasMicrophone: has_microphone === 'true',
            hasCamera: has_camera === 'true',
            hasAirConditioner: has_air_conditioner === 'true',
            hasNoiseCancelling: has_noise_cancelling === 'true',
            userId: null,
        });
        res.status(201).json({
            status: 'success',
            data: {
                room: newRoom,
            },
        });
    }
    catch (error) {
        next(error);
    }
}
