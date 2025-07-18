import { Request, Response, NextFunction } from 'express';
import { exec, ExecException } from 'child_process';
import { HttpError } from '../../types/errors';

export async function runPrismaStudio(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Only allow if user is admin (role checked by middleware)
    exec(
      'npx prisma studio',
      { cwd: process.cwd() },
      (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          return next(
            new HttpError(
              500,
              `Prisma Studio başlatılamadı: ${stderr || error.message}`
            )
          );
        }
        res.status(200).json({
          status: 'success',
          message: 'Prisma Studio başlatıldı. Lütfen terminali kontrol edin.',
          output: stdout,
        });
      }
    );
  } catch (error) {
    next(error);
  }
}
