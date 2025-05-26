import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, surname, email, password } = req.body;

  try {
    const newUser = await userService.signup({
      name,
      surname,
      email,
      password,
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
