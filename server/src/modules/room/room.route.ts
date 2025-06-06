import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/request-validator.middleware';
import * as roomController from './room.controller';

const router = express.Router();

// POST /api/v1/rooms
router.post(
  '/',
  [
    body('room_number').trim().notEmpty().isString(),
    body('floor').trim().notEmpty().isInt(),
    body('room_type').trim().notEmpty().isString(),
    body('capacity').trim().notEmpty().isInt(),
    body('area_sqm').trim().notEmpty().isInt(),
    body('chair_count').trim().notEmpty().isInt(),
    body('window_count').trim().notEmpty().isInt(),
    body('has_natural_light').trim().notEmpty().isBoolean(),
    body('has_projector').trim().notEmpty().isBoolean(),
    body('has_microphone').trim().notEmpty().isBoolean(),
    body('has_camera').trim().notEmpty().isBoolean(),
    body('has_air_conditioner').trim().notEmpty().isBoolean(),
    body('has_noise_cancelling').trim().notEmpty().isBoolean(),
  ],
  validateRequest,
  roomController.createRoom
);

export default router;
