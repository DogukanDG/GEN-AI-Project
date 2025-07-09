import { PrismaClient } from '@prisma/client';
import { CreateReservationDto, UpdateReservationDto, ReservationQuery } from '../../types/reservation';

const prisma = new PrismaClient();

export class ReservationRepository {
  
  async create(data: CreateReservationDto) {
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

  async findById(id: number) {
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

  async findMany(query: ReservationQuery = {}) {
    const where: any = {};

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
    } else if (query.startDate) {
      where.startDatetime = {
        gte: query.startDate
      };
    } else if (query.endDate) {
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

  async update(id: number, data: UpdateReservationDto) {
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

  async delete(id: number) {
    return await prisma.reservation.delete({
      where: { id }
    });
  }

  async checkRoomAvailability(roomNumber: string, startDatetime: Date, endDatetime: Date, excludeId?: number) {
    const where: any = {
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

  async getUserReservations(userEmail: string) {
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

  async getUpcomingReservations(limit: number = 10) {
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
}

export default new ReservationRepository();
