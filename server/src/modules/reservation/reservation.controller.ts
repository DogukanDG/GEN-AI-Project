import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import reservationService from './reservation.service';
import { HttpBodyValidationError } from '../../types/errors';
import { CreateReservationDto, UpdateReservationDto, ReservationQuery } from '../../types/reservation';

export class ReservationController {

  async createReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new HttpBodyValidationError(400, errors.array()));
        return;
      }

      const reservationData: CreateReservationDto = {
        roomNumber: req.body.roomNumber,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        startDatetime: new Date(req.body.startDatetime),
        endDatetime: new Date(req.body.endDatetime),
        purpose: req.body.purpose,
        userId: req.body.userId
      };

      const result = await reservationService.createReservation(reservationData);

      res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new HttpBodyValidationError(400, errors.array()));
        return;
      }

      const query: ReservationQuery = {
        roomNumber: req.query.roomNumber as string,
        userEmail: req.query.userEmail as string,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        status: req.query.status as string
      };

      const reservations = await reservationService.getReservations(query);

      res.status(200).json({
        success: true,
        message: 'Reservations retrieved successfully',
        data: reservations,
        count: reservations.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getReservationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid reservation ID'
        });
        return;
      }

      const reservation = await reservationService.getReservationById(id);

      res.status(200).json({
        success: true,
        message: 'Reservation retrieved successfully',
        data: reservation
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new HttpBodyValidationError(400, errors.array()));
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid reservation ID'
        });
        return;
      }

      const updateData: UpdateReservationDto = {};
      
      if (req.body.userName) updateData.userName = req.body.userName;
      if (req.body.userEmail) updateData.userEmail = req.body.userEmail;
      if (req.body.startDatetime) updateData.startDatetime = new Date(req.body.startDatetime);
      if (req.body.endDatetime) updateData.endDatetime = new Date(req.body.endDatetime);
      if (req.body.bookingStatus) updateData.bookingStatus = req.body.bookingStatus;
      if (req.body.purpose) updateData.purpose = req.body.purpose;

      const reservation = await reservationService.updateReservation(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Reservation updated successfully',
        data: reservation
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid reservation ID'
        });
        return;
      }

      const reservation = await reservationService.cancelReservation(id);

      res.status(200).json({
        success: true,
        message: 'Reservation cancelled successfully',
        data: reservation
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid reservation ID'
        });
        return;
      }

      await reservationService.deleteReservation(id);

      res.status(200).json({
        success: true,
        message: 'Reservation deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.params.email;
      if (!userEmail) {
        res.status(400).json({
          success: false,
          message: 'User email is required'
        });
        return;
      }

      const reservations = await reservationService.getUserReservations(userEmail);

      res.status(200).json({
        success: true,
        message: 'User reservations retrieved successfully',
        data: reservations,
        count: reservations.length
      });
    } catch (error) {
      next(error);
    }
  }

  async searchRoomsWithAI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('searchRoomsWithAI called with body:', req.body);
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        console.log('Invalid prompt:', prompt);
        res.status(400).json({
          success: false,
          message: 'Prompt is required and must be a string'
        });
        return;
      }

      console.log('Calling reservationService.searchRoomsWithAI with prompt:', prompt);
      const result = await reservationService.searchRoomsWithAI(prompt);
      console.log('Search result:', result);

      res.status(200).json({
        success: true,
        message: 'Room search completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in searchRoomsWithAI:', error);
      next(error);
    }
  }

  async checkRoomAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomNumber, startDatetime, endDatetime } = req.body;
      
      if (!roomNumber || !startDatetime || !endDatetime) {
        res.status(400).json({
          success: false,
          message: 'Room number, start datetime, and end datetime are required'
        });
        return;
      }

      const isAvailable = await reservationService.checkRoomAvailability(
        roomNumber,
        new Date(startDatetime),
        new Date(endDatetime)
      );

      res.status(200).json({
        success: true,
        message: 'Room availability checked successfully',
        data: {
          roomNumber,
          startDatetime,
          endDatetime,
          isAvailable
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const reservations = await reservationService.getUpcomingReservations(limit);

      res.status(200).json({
        success: true,
        message: 'Upcoming reservations retrieved successfully',
        data: reservations,
        count: reservations.length
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReservationController();
