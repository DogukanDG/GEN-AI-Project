import { RoomFeature } from '@prisma/client';

export type CreateRoomInput = Omit<
  RoomFeature,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateRoomInput = Partial<CreateRoomInput>;
