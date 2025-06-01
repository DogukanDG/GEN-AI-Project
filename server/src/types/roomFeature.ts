export interface CreateRoomFeatureRequest {
  title: string;
  description: string;
}

export interface UpdateRoomFeatureRequest {
  title?: string;
  description?: string;
}

export interface RoomFeatureResponse {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
