export interface CreateRoomFeatureRequest {
  roomNumber: string;
  floor: number;
  roomType: string;
  capacity: number;
  areaSqm: number;
  windowCount: number;
  hasNaturalLight: boolean;
  hasProjector: boolean;
  hasMicrophone: boolean;
  hasCamera: boolean;
  hasAirConditioner: boolean;
  hasNoiseCancelling: boolean;
}

export interface UpdateRoomFeatureRequest {
  roomNumber?: string;
  floor?: number;
  roomType?: string;
  capacity?: number;
  areaSqm?: number;
  windowCount?: number;
  hasNaturalLight?: boolean;
  hasProjector?: boolean;
  hasMicrophone?: boolean;
  hasCamera?: boolean;
  hasAirConditioner?: boolean;
  hasNoiseCancelling?: boolean;
}

export interface RoomFeatureResponse {
  id: number;
  roomNumber: string;
  floor: number;
  roomType: string;
  capacity: number;
  areaSqm: number;
  windowCount: number;
  hasNaturalLight: boolean;
  hasProjector: boolean;
  hasMicrophone: boolean;
  hasCamera: boolean;
  hasAirConditioner: boolean;
  hasNoiseCancelling: boolean;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomDummyData {
  room_number: string;
  floor: number;
  room_type: string;
  capacity: number;
  area_sqm: number;
  window_count: number;
  has_natural_light: boolean;
  has_projector: boolean;
  has_microphone: boolean;
  has_camera: boolean;
  has_air_conditioner: boolean;
  has_noise_cancelling: boolean;
}
