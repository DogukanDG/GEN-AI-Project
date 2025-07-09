import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, surname, email, password } = req.body;

  try {
    const result = await authService.register({ name, surname, email, password });

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
