"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReservationRepository {
    async create(data) {
        return await prisma.reservation.create({
            data,
            include: {
                roomFeature: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true
                    }
                }
            }
        });
    }
    async findById(id) {
        return await prisma.reservation.findUnique({
            where: { id },
            include: {
                roomFeature: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true
                    }
                }
            }
        });
    }
    async findMany(query = {}) {
        const where = {};
        if (query.roomNumber) {
            where.roomNumber = query.roomNumber;
        }
        if (query.userEmail) {
            where.userEmail = query.userEmail;
        }
        if (query.userId) {
            where.userId = query.userId;
        }
        if (query.status) {
            where.bookingStatus = query.status;
        }
        if (query.startDate && query.endDate) {
            where.AND = [
                {
                    startDatetime: {
                        gte: query.startDate
                    }
                },
                {
                    endDatetime: {
                        lte: query.endDate
                    }
                }
            ];
        }
        else if (query.startDate) {
            where.startDatetime = {
                gte: query.startDate
            };
        }
        else if (query.endDate) {
            where.endDatetime = {
                lte: query.endDate
            };
        }
        return await prisma.reservation.findMany({
            where,
            include: {
                roomFeature: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true
                    }
                }
            },
            orderBy: {
                startDatetime: 'asc'
            }
        });
    }
    async update(id, data) {
        return await prisma.reservation.update({
            where: { id },
            data,
            include: {
                roomFeature: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true
                    }
                }
            }
        });
    }
    async delete(id) {
        return await prisma.reservation.delete({
            where: { id }
        });
    }
    async checkRoomAvailability(roomNumber, startDatetime, endDatetime, excludeId) {
        const where = {
            roomNumber,
            bookingStatus: 'confirmed',
            OR: [
                {
                    AND: [
                        { startDatetime: { lte: startDatetime } },
                        { endDatetime: { gt: startDatetime } }
                    ]
                },
                {
                    AND: [
                        { startDatetime: { lt: endDatetime } },
                        { endDatetime: { gte: endDatetime } }
                    ]
                },
                {
                    AND: [
                        { startDatetime: { gte: startDatetime } },
                        { endDatetime: { lte: endDatetime } }
                    ]
                }
            ]
        };
        if (excludeId) {
            where.NOT = { id: excludeId };
        }
        const conflictingReservations = await prisma.reservation.findMany({
            where
        });
        return conflictingReservations.length === 0;
    }
    async getUserReservations(userEmail) {
        return await prisma.reservation.findMany({
            where: {
                userEmail,
                bookingStatus: {
                    not: 'cancelled'
                }
            },
            include: {
                roomFeature: true
            },
            orderBy: {
                startDatetime: 'asc'
            }
        });
    }
    async getUpcomingReservations(limit = 10) {
        const now = new Date();
        return await prisma.reservation.findMany({
            where: {
                startDatetime: {
                    gte: now
                },
                bookingStatus: 'confirmed'
            },
            include: {
                roomFeature: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true
                    }
                }
            },
            orderBy: {
                startDatetime: 'asc'
            },
            take: limit
        });
    }
    async getReservedSlots(roomNumber, date) {
        // Parse the date to get start and end of the day in UTC
        const startOfDay = new Date(date + 'T00:00:00.000Z');
        const endOfDay = new Date(date + 'T23:59:59.999Z');
        const reservations = await prisma.reservation.findMany({
            where: {
                roomNumber,
                bookingStatus: 'confirmed',
                OR: [
                    {
                        // Reservation starts on this day
                        startDatetime: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    {
                        // Reservation ends on this day
                        endDatetime: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    {
                        // Reservation spans across this day
                        AND: [
                            { startDatetime: { lte: startOfDay } },
                            { endDatetime: { gte: endOfDay } }
                        ]
                    }
                ]
            },
            select: {
                startDatetime: true,
                endDatetime: true
            },
            orderBy: {
                startDatetime: 'asc'
            }
        });
        // Convert to time slot strings (HH:MM-HH:MM format)
        return reservations.map(reservation => {
            // Use UTC time to avoid timezone issues
            const startHours = reservation.startDatetime.getUTCHours().toString().padStart(2, '0');
            const startMinutes = reservation.startDatetime.getUTCMinutes().toString().padStart(2, '0');
            const endHours = reservation.endDatetime.getUTCHours().toString().padStart(2, '0');
            const endMinutes = reservation.endDatetime.getUTCMinutes().toString().padStart(2, '0');
            const startTime = `${startHours}:${startMinutes}`;
            const endTime = `${endHours}:${endMinutes}`;
            return `${startTime}-${endTime}`;
        });
    }
}
exports.ReservationRepository = ReservationRepository;
exports.default = new ReservationRepository();