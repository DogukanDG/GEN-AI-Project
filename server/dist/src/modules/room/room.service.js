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
exports.deleteRoom = deleteRoom;
exports.findById = findById;
const roomRepository = __importStar(require("./room.repository"));
const errors_1 = require("../../types/errors");
/**
 * Creates a room and returns it.
 * @returns Created room object
 */
async function createRoom(data) {
    const isRoomExist = await roomRepository.findByRoomNumber(data.roomNumber);
    if (isRoomExist) {
        throw new errors_1.HttpError(409, 'Room already exist');
    }
    return await roomRepository.createRoom(data);
}
/**
 * Deletes a room and returns it.
 * @returns Deleted room object
 */
async function deleteRoom(roomId) {
    return await roomRepository.deleteRoom(roomId);
}
/**
 * Finds a room by its id.
 * @returns Room object
 */
async function findById(roomId) {
    const room = await roomRepository.findById(roomId);
    return room ? room : null;
}
