import jwt from 'jsonwebtoken';

export interface LoginJwtPayload extends jwt.JwtPayload {
  id: number;
}
