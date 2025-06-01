import { RoomFeatureRepository } from './roomFeature.repository';
import { CreateRoomFeatureRequest, UpdateRoomFeatureRequest, RoomFeatureResponse } from '../../types/roomFeature';
import { NotFoundError, BadRequestError } from '../../types/errors';

export class RoomFeatureService {
  private roomFeatureRepository: RoomFeatureRepository;

  constructor() {
    this.roomFeatureRepository = new RoomFeatureRepository();
  }

  async createRoomFeature(userId: number, data: CreateRoomFeatureRequest): Promise<RoomFeatureResponse> {
    if (!data.title || data.title.trim().length === 0) {
      throw new BadRequestError('Title is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new BadRequestError('Description is required');
    }

    const roomFeature = await this.roomFeatureRepository.create(userId, {
      title: data.title.trim(),
      description: data.description.trim(),
    });

    return roomFeature;
  }

  async getRoomFeatureById(id: number): Promise<RoomFeatureResponse> {
    const roomFeature = await this.roomFeatureRepository.findById(id);
    
    if (!roomFeature) {
      throw new NotFoundError('Room feature not found');
    }

    return roomFeature;
  }

  async getUserRoomFeatures(userId: number): Promise<RoomFeatureResponse[]> {
    return await this.roomFeatureRepository.findByUserId(userId);
  }

  async getAllRoomFeatures(): Promise<RoomFeatureResponse[]> {
    return await this.roomFeatureRepository.findAll();
  }

  async updateRoomFeature(id: number, userId: number, data: UpdateRoomFeatureRequest): Promise<RoomFeatureResponse> {
    // Check if room feature exists and belongs to user
    const existingRoomFeature = await this.roomFeatureRepository.findByIdAndUserId(id, userId);
    
    if (!existingRoomFeature) {
      throw new NotFoundError('Room feature not found or you do not have permission to update it');
    }

    // Validate data
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new BadRequestError('Title cannot be empty');
    }

    if (data.description !== undefined && data.description.trim().length === 0) {
      throw new BadRequestError('Description cannot be empty');
    }

    // Prepare update data
    const updateData: UpdateRoomFeatureRequest = {};
    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description.trim();
    }

    return await this.roomFeatureRepository.update(id, userId, updateData);
  }

  async deleteRoomFeature(id: number, userId: number): Promise<void> {
    // Check if room feature exists and belongs to user
    const existingRoomFeature = await this.roomFeatureRepository.findByIdAndUserId(id, userId);
    
    if (!existingRoomFeature) {
      throw new NotFoundError('Room feature not found or you do not have permission to delete it');
    }

    await this.roomFeatureRepository.delete(id, userId);
  }
}
