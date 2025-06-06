import { Room } from '@prisma/client';

export type CreateRoomInput = Omit<
  Room,
  'room_id' | 'created_at' | 'updated_at'
>;
export type UpdateRoomInput = Partial<CreateRoomInput>;
