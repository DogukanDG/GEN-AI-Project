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
      role: role || 'normal', // Default to 'normal' if role is not provided
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

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
