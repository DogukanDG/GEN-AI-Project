import { Request, Response, NextFunction } from 'express';
import * as roomService from './room.service';

export async function createRoom(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const {
    room_number,
    floor,
    room_type,
    capacity,
    area_sqm,
    chair_count,
    window_count,
    has_natural_light,
    has_projector,
    has_microphone,
    has_camera,
    has_air_conditioner,
    has_noise_cancelling,
  } = req.body;

  try {
    const newRoom = await roomService.createRoom({
      room_number: room_number,
      floor: Number(floor),
      room_type: room_type,
      capacity: Number(capacity),
      area_sqm: Number(area_sqm),
      chair_count: Number(chair_count),
      window_count: Number(window_count),
      has_natural_light: has_natural_light === 'true',
      has_projector: has_projector === 'true',
      has_microphone: has_microphone === 'true',
      has_camera: has_camera === 'true',
      has_air_conditioner: has_air_conditioner === 'true',
      has_noise_cancelling: has_noise_cancelling === 'true',
    });

    res.status(201).json({
      status: 'success',
      data: {
        room: newRoom,
      },
    });
  } catch (error) {
    next(error);
  }
}
