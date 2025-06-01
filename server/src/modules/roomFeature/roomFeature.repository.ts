import prisma from '../../configs/database';
import { CreateRoomFeatureRequest, UpdateRoomFeatureRequest } from '../../types/roomFeature';

export class RoomFeatureRepository {
  async create(userId: number, data: CreateRoomFeatureRequest) {
    return await prisma.roomFeature.create({
      data: {
        title: data.title,
        description: data.description,
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
        userId, // Ensure user can only update their own room features
      },
      data,
    });
  }

  async delete(id: number, userId: number) {
    return await prisma.roomFeature.delete({
      where: { 
        id,
        userId, // Ensure user can only delete their own room features
      },
    });
  }

  async findByIdAndUserId(id: number, userId: number) {
    return await prisma.roomFeature.findFirst({
      where: { 
        id,
        userId,
      },
    });
  }
}
