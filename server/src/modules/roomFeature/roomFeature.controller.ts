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
      const { title, description } = req.body;

      const roomFeature = await this.roomFeatureService.createRoomFeature(user.id, {
        title,
        description,
      });

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
      const roomFeature = await this.roomFeatureService.getRoomFeatureById(parseInt(id));

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
      const roomFeatures = await this.roomFeatureService.getUserRoomFeatures(user.id);

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
      const { title, description } = req.body;

      const roomFeature = await this.roomFeatureService.updateRoomFeature(
        parseInt(id),
        user.id,
        { title, description }
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
}
