import { Request, Response } from 'express';
import { RoomFeatureService } from './roomFeature.service';
import { CustomJwtPayload } from '../../types/customJwtPayload';

export class RoomFeatureController {
  private roomFeatureService: RoomFeatureService;

  constructor() {
    this.roomFeatureService = new RoomFeatureService();
  }
  createRoomFeature = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const {
        roomNumber,
        floor,
        roomType,
        capacity,
        areaSqm,
        windowCount,
        hasNaturalLight,
        hasProjector,
        hasMicrophone,
        hasCamera,
        hasAirConditioner,
        hasNoiseCancelling,
      } = req.body;

      const roomFeature = await this.roomFeatureService.createRoomFeature(
        user.id,
        {
          roomNumber,
          floor,
          roomType,
          capacity,
          areaSqm,
          windowCount,
          hasNaturalLight,
          hasProjector,
          hasMicrophone,
          hasCamera,
          hasAirConditioner,
          hasNoiseCancelling,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Room feature created successfully',
        data: roomFeature,
      });
    } catch (error) {
      throw error;
    }
  };

  getRoomFeatureById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const roomFeature = await this.roomFeatureService.getRoomFeatureById(
        parseInt(id)
      );

      res.status(200).json({
        success: true,
        data: roomFeature,
      });
    } catch (error) {
      throw error;
    }
  };

  getUserRoomFeatures = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const roomFeatures = await this.roomFeatureService.getUserRoomFeatures(
        user.id
      );

      res.status(200).json({
        success: true,
        data: roomFeatures,
        count: roomFeatures.length,
      });
    } catch (error) {
      throw error;
    }
  };

  getAllRoomFeatures = async (req: Request, res: Response): Promise<void> => {
    try {
      const roomFeatures = await this.roomFeatureService.getAllRoomFeatures();

      res.status(200).json({
        success: true,
        data: roomFeatures,
        count: roomFeatures.length,
      });
    } catch (error) {
      throw error;
    }
  };
  updateRoomFeature = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const { id } = req.params;
      const {
        roomNumber,
        floor,
        roomType,
        capacity,
        areaSqm,
        windowCount,
        hasNaturalLight,
        hasProjector,
        hasMicrophone,
        hasCamera,
        hasAirConditioner,
        hasNoiseCancelling,
      } = req.body;

      const roomFeature = await this.roomFeatureService.updateRoomFeature(
        parseInt(id),
        user.id,
        {
          roomNumber,
          floor,
          roomType,
          capacity,
          areaSqm,
          windowCount,
          hasNaturalLight,
          hasProjector,
          hasMicrophone,
          hasCamera,
          hasAirConditioner,
          hasNoiseCancelling,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Room feature updated successfully',
        data: roomFeature,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteRoomFeature = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const { id } = req.params;

      await this.roomFeatureService.deleteRoomFeature(parseInt(id), user.id);

      res.status(200).json({
        success: true,
        message: 'Room feature deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  };

  // Room CRUD for admin panel
  getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
      const rooms = await this.roomFeatureService.getAllRoomFeatures();
      res.status(200).json({ status: 'success', data: { rooms } });
    } catch (error) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Failed to fetch rooms' });
    }
  };

  getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const room = await this.roomFeatureService.getRoomFeatureById(id);
      if (!room) {
        res.status(404).json({ status: 'fail', message: 'Room not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: { room } });
    } catch (error) {
      res.status(500).json({ status: 'fail', message: 'Failed to fetch room' });
    }
  };

  createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const newRoom = await this.roomFeatureService.createRoomFeature(
        user.id,
        req.body
      );
      res.status(201).json({ status: 'success', data: { room: newRoom } });
    } catch (error) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Failed to create room' });
    }
  };

  updateRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const id = parseInt(req.params.id);
      const updatedRoom = await this.roomFeatureService.updateRoomFeature(
        id,
        user.id,
        req.body
      );
      res.status(200).json({ status: 'success', data: { room: updatedRoom } });
    } catch (error) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Failed to update room' });
    }
  };

  deleteRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as CustomJwtPayload;
      const id = parseInt(req.params.id);
      await this.roomFeatureService.deleteRoomFeature(id, user.id);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Failed to delete room' });
    }
  };
}
