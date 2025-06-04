import { Room } from '@prisma/client';
import * as roomRepository from './room.repository';
import { CreateRoomInput } from '../../types/room';

/**
 * Creates a room and returns it.
 * @returns Created room object
 */
export async function createRoom(data: CreateRoomInput) {
  return await roomRepository.createRoom(data);
}

/**
 * Deletes a room and returns it.
 * @returns Deleted room object
 */
export async function deleteRoom(roomId: number) {
  return await roomRepository.deleteRoom(roomId);
}

/**
 * Finds a room by its id.
 * @returns Room object
 */
export async function findById(roomId: number): Promise<Room | null> {
  const room = await roomRepository.findById(roomId);
  return room ? room : null;
}
