import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, surname, email, password, role } = req.body;

  try {
    const newUser = await userService.signup({
      name,
      surname,
      email,
      password,
      role: role || 'normal',
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function assignAdminRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;

  try {
    await userService.assignAdminRole(userId);

    res.status(201).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
