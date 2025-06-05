import prisma from '../../configs/database';
import { CreateRoomFeatureRequest, UpdateRoomFeatureRequest } from '../../types/roomFeature';

export class RoomFeatureRepository {  async create(userId: number, data: CreateRoomFeatureRequest) {
    return await prisma.roomFeature.create({
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

  async findById(id: number) {
    return await prisma.roomFeature.findUnique({
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
  async findByUserId(userId: number) {
    return await prisma.roomFeature.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findAll() {
    return await prisma.roomFeature.findMany({
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

  async update(id: number, userId: number, data: UpdateRoomFeatureRequest) {
    return await prisma.roomFeature.update({
      where: { 
        id,
        ...(userId && { userId }), // Only filter by userId if provided
      },
      data,
    });
  }

  async delete(id: number, userId: number) {
    return await prisma.roomFeature.delete({
      where: { 
        id,
        ...(userId && { userId }), // Only filter by userId if provided
      },
    });
  }

  async findByIdAndUserId(id: number, userId: number) {
    return await prisma.roomFeature.findFirst({
      where: { 
        id,
        ...(userId && { userId }),
      },
    });
  }
}
