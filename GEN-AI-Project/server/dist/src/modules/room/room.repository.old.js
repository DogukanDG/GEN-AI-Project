"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
exports.findByRoomNumber = findByRoomNumber;
exports.findById = findById;
exports.findAllRooms = findAllRooms;
exports.updateRoom = updateRoom;
exports.deleteRoom = deleteRoom;
exports.findAvailableRooms = findAvailableRooms;
const database_1 = __importDefault(require("../../configs/database"));
const errors_1 = require("../../types/errors");
async function createRoom(data) {
    try {
        return await database_1.default.room.create({ data });
    }
    catch (e) {
        console.log(e);
        throw new errors_1.HttpError(500, 'Room could not be created');
    }
}
async function findByRoomNumber(roomNumber) {
    try {
        return await database_1.default.room.findUnique({ where: { room_number: roomNumber } });
    }
    catch {
        throw new errors_1.HttpError(500, 'Room could not be fetched');
    }
}
async function findById(roomId) {
    try {
        return await database_1.default.room.findUnique({ where: { room_id: roomId } });
    }
    catch {
        throw new errors_1.HttpError(500, 'Room could not be fetched');
    }
}
async function findAllRooms() {
    try {
        return await database_1.default.room.findMany();
    }
    catch {
        throw new errors_1.HttpError(500, 'Rooms could not be fetched');
    }
}
async function updateRoom(roomId, data) {
    try {
        return await database_1.default.room.update({
            where: { room_id: roomId },
            data,
        });
    }
    catch {
        throw new errors_1.HttpError(500, 'Room could not be updated');
    }
}
async function deleteRoom(roomId) {
    try {
        return await database_1.default.room.delete({
            where: { room_id: roomId },
        });
    }
    catch {
        throw new errors_1.HttpError(500, 'Room could not be deleted');
    }
}
async function findAvailableRooms(startDatetime, endDatetime) {
    try {
        return await database_1.default.room.findMany({
            where: {
                reservations: {
                    none: {
                        AND: [
                            { start_datetime: { lt: endDatetime } },
                            { end_datetime: { gt: startDatetime } },
                        ],
                    },
                },
            },
        });
    }
    catch {
        throw new errors_1.HttpError(500, 'Available rooms could not be fetched');
    }
}
