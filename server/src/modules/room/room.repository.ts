import prisma from '../../configs/database';
import { Room } from '@prisma/client';
import { CreateRoomInput, UpdateRoomInput } from '../../types/room';
import { HttpError } from '../../types/errors';

export async function createRoom(data: CreateRoomInput): Promise<Room> {
  try {
    return await prisma.room.create({ data });
  } catch (e) {
    console.log(e);

    throw new HttpError(500, 'Room could not be created');
  }
}

export async function findByRoomNumber(
  roomNumber: string
): Promise<Room | null> {
  try {
    return await prisma.room.findUnique({ where: { room_number: roomNumber } });
  } catch {
    throw new HttpError(500, 'Room could not be fetched');
  }
}

export async function findById(roomId: number): Promise<Room | null> {
  try {
    return await prisma.room.findUnique({ where: { room_id: roomId } });
  } catch {
    throw new HttpError(500, 'Room could not be fetched');
  }
}

export async function findAllRooms(): Promise<Room[]> {
  try {
    return await prisma.room.findMany();
  } catch {
    throw new HttpError(500, 'Rooms could not be fetched');
  }
}

export async function updateRoom(
  roomId: number,
  data: UpdateRoomInput
): Promise<Room> {
  try {
    return await prisma.room.update({
      where: { room_id: roomId },
      data,
    });
  } catch {
    throw new HttpError(500, 'Room could not be updated');
  }
}

export async function deleteRoom(roomId: number): Promise<Room> {
  try {
    return await prisma.room.delete({
      where: { room_id: roomId },
    });
  } catch {
    throw new HttpError(500, 'Room could not be deleted');
  }
}

export async function findAvailableRooms(
  startDatetime: Date,
  endDatetime: Date
): Promise<Room[]> {
  try {
    return await prisma.room.findMany({
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
  } catch {
    throw new HttpError(500, 'Available rooms could not be fetched');
  }
}
