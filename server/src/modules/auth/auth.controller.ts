import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
