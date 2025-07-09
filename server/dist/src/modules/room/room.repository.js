"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
exports.findByRoomNumber = findByRoomNumber;
exports.findById = findById;
exports.findAll = findAll;
exports.updateRoom = updateRoom;
exports.deleteRoom = deleteRoom;
exports.searchRooms = searchRooms;
const database_1 = __importDefault(require("../../configs/database"));
const errors_1 = require("../../types/errors");
async function createRoom(data) {
    try {
        return await database_1.default.roomFeature.create({ data });
    }
    catch (error) {
        console.error('Database error in createRoom:', error);
        throw new errors_1.HttpError(500, 'Room could not be created');
    }
}
/**
 * Finds a room by its room number
 * @param roomNumber The room number to search for
 * @returns The room if found, null otherwise
 */
async function findByRoomNumber(roomNumber) {
    try {
        return await database_1.default.roomFeature.findUnique({ where: { roomNumber } });
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Data could not be fetched');
    }
}
async function findById(roomId) {
    try {
        return await database_1.default.roomFeature.findUnique({ where: { id: roomId } });
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Data could not be fetched');
    }
}
async function findAll() {
    try {
        return await database_1.default.roomFeature.findMany();
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Data could not be fetched');
    }
}
async function updateRoom(roomId, data) {
    try {
        return await database_1.default.roomFeature.update({
            where: { id: roomId },
            data
        });
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Room could not be updated');
    }
}
async function deleteRoom(roomId) {
    try {
        return await database_1.default.roomFeature.delete({
            where: { id: roomId }
        });
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Room could not be deleted');
    }
}
async function searchRooms(filters) {
    try {
        return await database_1.default.roomFeature.findMany({
            where: filters
        });
    }
    catch (error) {
        throw new errors_1.HttpError(500, 'Data could not be fetched');
    }
}
