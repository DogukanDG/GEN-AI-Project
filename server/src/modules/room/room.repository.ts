import prisma from '../../configs/database';
import { RoomFeature } from '@prisma/client';
import { HttpError } from '../../types/errors';

export async function createRoom(data: any): Promise<RoomFeature> {
  try {
    return await prisma.roomFeature.create({ data });
  } catch (error) {
    console.error('Database error in createRoom:', error);
    throw new HttpError(500, 'Room could not be created');
  }
}

/**
 * Finds a room by its room number
 * @param roomNumber The room number to search for
 * @returns The room if found, null otherwise
 */
export async function findByRoomNumber(roomNumber: string): Promise<RoomFeature | null> {
  try {
    return await prisma.roomFeature.findUnique({ where: { roomNumber } });
  } catch (error) {
    throw new HttpError(500, 'Data could not be fetched');
  }
}

export async function findById(roomId: number): Promise<RoomFeature | null> {
  try {
    return await prisma.roomFeature.findUnique({ where: { id: roomId } });
  } catch (error) {
    throw new HttpError(500, 'Data could not be fetched');
  }
}

export async function findAll(): Promise<RoomFeature[]> {
  try {
    return await prisma.roomFeature.findMany();
  } catch (error) {
    throw new HttpError(500, 'Data could not be fetched');
  }
}

export async function updateRoom(roomId: number, data: any): Promise<RoomFeature> {
  try {
    return await prisma.roomFeature.update({
      where: { id: roomId },
      data
    });
  } catch (error) {
    throw new HttpError(500, 'Room could not be updated');
  }
}

export async function deleteRoom(roomId: number): Promise<RoomFeature> {
  try {
    return await prisma.roomFeature.delete({
      where: { id: roomId }
    });
  } catch (error) {
    throw new HttpError(500, 'Room could not be deleted');
  }
}

export async function searchRooms(filters: any): Promise<RoomFeature[]> {
  try {
    return await prisma.roomFeature.findMany({
      where: filters
    });
  } catch (error) {
    throw new HttpError(500, 'Data could not be fetched');
  }
}
