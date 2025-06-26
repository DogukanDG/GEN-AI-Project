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
      roomNumber: room_number,
      floor: Number(floor),
      roomType: room_type,
      capacity: Number(capacity),
      areaSqm: Number(area_sqm),
      windowCount: Number(window_count),
      hasNaturalLight: has_natural_light === 'true',
      hasProjector: has_projector === 'true',
      hasMicrophone: has_microphone === 'true',
      hasCamera: has_camera === 'true',
      hasAirConditioner: has_air_conditioner === 'true',
      hasNoiseCancelling: has_noise_cancelling === 'true',
      userId: null,
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
