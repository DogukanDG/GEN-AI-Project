import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AdminController {
  // Get database statistics
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalUsers, totalReservations, totalRooms] = await Promise.all([
        prisma.user.count(),
        prisma.reservation.count(),
        prisma.roomFeature.count()
      ]);

      const recentReservations = await prisma.reservation.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      });

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalReservations,
          totalRooms,
          recentReservations
        }
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      next(error);
    }
  }

  // Get all tables info
  async getTables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tables = [
        {
          name: 'User',
          count: await prisma.user.count(),
          fields: ['id', 'name', 'surname', 'email', 'role', 'createdAt']
        },
        {
          name: 'Reservation',
          count: await prisma.reservation.count(),
          fields: ['id', 'roomFeatureId', 'userId', 'startDatetime', 'endDatetime', 'purpose', 'bookingStatus']
        },
        {
          name: 'RoomFeature',
          count: await prisma.roomFeature.count(),
          fields: ['id', 'roomNumber', 'floor', 'roomType', 'capacity', 'areaSqm', 'hasProjector']
        }
      ];

      res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      console.error('Error in getTables:', error);
      next(error);
    }
  }

  // Get all users
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Admin getUsers called with query:', req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      console.log('User pagination params:', { page, limit, skip });

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            role: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count()
      ]);

      console.log('Users found:', users.length, 'Total:', total);

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error in getUsers:', error);
      next(error);
    }
  }

  // Update user
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      next(error);
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      next(error);
    }
  }

  // Get all reservations
  async getReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Admin getReservations called with query:', req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      console.log('Reservation pagination params:', { page, limit, skip });

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          skip,
          take: limit,
          include: {
            roomFeature: {
              select: {
                roomNumber: true,
                roomType: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.reservation.count()
      ]);

      console.log('Reservations found:', reservations.length, 'Total:', total);

      res.status(200).json({
        success: true,
        data: reservations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error in getReservations:', error);
      next(error);
    }
  }

  // Create reservation
  async createReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reservationData = req.body;
      console.log('Create reservation data received:', reservationData);

      // Process reservation data with proper types
      const processedData = {
        roomNumber: reservationData.roomNumber,
        userName: reservationData.userName || '',
        userEmail: reservationData.userEmail || '',
        startDatetime: new Date(reservationData.startDatetime),
        endDatetime: new Date(reservationData.endDatetime),
        purpose: reservationData.purpose || '',
        bookingStatus: reservationData.bookingStatus || 'pending',
        userId: reservationData.userId ? parseInt(reservationData.userId) : null
      };

      console.log('Processed reservation data:', processedData);

      const newReservation = await prisma.reservation.create({
        data: processedData,
        include: {
          roomFeature: {
            select: {
              roomNumber: true,
              roomType: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: newReservation
      });
    } catch (error) {
      console.error('Error in createReservation:', error);
      next(error);
    }
  }

  // Update reservation
  async updateReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      console.log('Update reservation data received:', updateData);

      // Filter and process only valid reservation fields
      const processedData: any = {};
      
      if (updateData.roomNumber !== undefined) processedData.roomNumber = updateData.roomNumber;
      if (updateData.userName !== undefined) processedData.userName = updateData.userName;
      if (updateData.userEmail !== undefined) processedData.userEmail = updateData.userEmail;
      if (updateData.userId !== undefined) processedData.userId = updateData.userId ? parseInt(updateData.userId) : null;
      if (updateData.startDatetime !== undefined) processedData.startDatetime = new Date(updateData.startDatetime);
      if (updateData.endDatetime !== undefined) processedData.endDatetime = new Date(updateData.endDatetime);
      if (updateData.purpose !== undefined) processedData.purpose = updateData.purpose;
      if (updateData.bookingStatus !== undefined) processedData.bookingStatus = updateData.bookingStatus;

      console.log('Processed reservation data:', processedData);

      const updatedReservation = await prisma.reservation.update({
        where: { id: parseInt(id) },
        data: processedData,
        include: {
          roomFeature: {
            select: {
              roomNumber: true,
              roomType: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: updatedReservation
      });
    } catch (error) {
      console.error('Error in updateReservation:', error);
      next(error);
    }
  }

  // Delete reservation
  async deleteReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.reservation.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({
        success: true,
        message: 'Reservation deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteReservation:', error);
      next(error);
    }
  }

  // Get all room features
  async getRoomFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Admin getRoomFeatures called with query:', req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      console.log('RoomFeatures pagination params:', { page, limit, skip });

      const [roomFeatures, total] = await Promise.all([
        prisma.roomFeature.findMany({
          skip,
          take: limit,
          include: {
            _count: {
              select: {
                reservations: true
              }
            }
          },
          orderBy: { id: 'asc' }
        }),
        prisma.roomFeature.count()
      ]);

      console.log('RoomFeatures found:', roomFeatures.length, 'Total:', total);

      res.status(200).json({
        success: true,
        data: roomFeatures,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error in getRoomFeatures:', error);
      next(error);
    }
  }

  // Create room feature
  async createRoomFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomData = req.body;
      console.log('Received room data:', roomData);
      console.log('Data types:', {
        floor: typeof roomData.floor,
        capacity: typeof roomData.capacity,
        areaSqm: typeof roomData.areaSqm,
        windowCount: typeof roomData.windowCount
      });

      // Convert string values to proper types
      const processedData = {
        roomNumber: roomData.roomNumber,
        floor: parseInt(roomData.floor),
        roomType: roomData.roomType,
        capacity: parseInt(roomData.capacity),
        areaSqm: parseFloat(roomData.areaSqm),
        windowCount: parseInt(roomData.windowCount),
        hasNaturalLight: Boolean(roomData.hasNaturalLight),
        hasProjector: Boolean(roomData.hasProjector),
        hasMicrophone: Boolean(roomData.hasMicrophone),
        hasCamera: Boolean(roomData.hasCamera),
        hasAirConditioner: Boolean(roomData.hasAirConditioner),
        hasNoiseCancelling: Boolean(roomData.hasNoiseCancelling),
      };

      console.log('Processed data:', processedData);
      console.log('Processed data types:', {
        floor: typeof processedData.floor,
        capacity: typeof processedData.capacity,
        areaSqm: typeof processedData.areaSqm,
        windowCount: typeof processedData.windowCount
      });

      const newRoom = await prisma.roomFeature.create({
        data: processedData,
        include: {
          _count: {
            select: {
              reservations: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: newRoom
      });
    } catch (error) {
      console.error('Error in createRoomFeature:', error);
      next(error);
    }
  }

  // Update room feature
  async updateRoomFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert string values to proper types and filter out unwanted fields
      const processedData: any = {};
      
      if (updateData.roomNumber !== undefined) processedData.roomNumber = updateData.roomNumber;
      if (updateData.floor !== undefined) processedData.floor = parseInt(updateData.floor);
      if (updateData.roomType !== undefined) processedData.roomType = updateData.roomType;
      if (updateData.capacity !== undefined) processedData.capacity = parseInt(updateData.capacity);
      if (updateData.areaSqm !== undefined) processedData.areaSqm = parseFloat(updateData.areaSqm);
      if (updateData.windowCount !== undefined) processedData.windowCount = parseInt(updateData.windowCount);
      if (updateData.hasNaturalLight !== undefined) processedData.hasNaturalLight = Boolean(updateData.hasNaturalLight);
      if (updateData.hasProjector !== undefined) processedData.hasProjector = Boolean(updateData.hasProjector);
      if (updateData.hasMicrophone !== undefined) processedData.hasMicrophone = Boolean(updateData.hasMicrophone);
      if (updateData.hasCamera !== undefined) processedData.hasCamera = Boolean(updateData.hasCamera);
      if (updateData.hasAirConditioner !== undefined) processedData.hasAirConditioner = Boolean(updateData.hasAirConditioner);
      if (updateData.hasNoiseCancelling !== undefined) processedData.hasNoiseCancelling = Boolean(updateData.hasNoiseCancelling);

      const updatedRoom = await prisma.roomFeature.update({
        where: { id: parseInt(id) },
        data: processedData,
        include: {
          _count: {
            select: {
              reservations: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: updatedRoom
      });
    } catch (error) {
      console.error('Error in updateRoomFeature:', error);
      next(error);
    }
  }

  // Delete room feature
  async deleteRoomFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.roomFeature.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({
        success: true,
        message: 'Room feature deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteRoomFeature:', error);
      next(error);
    }
  }
}

export default new AdminController();
