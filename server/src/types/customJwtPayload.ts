import jwt from 'jsonwebtoken';

export interface LoginJwtPayload extends jwt.JwtPayload {
  id: number;
}

export interface CustomJwtPayload extends jwt.JwtPayload {
  id: number;
  email: string;
}
