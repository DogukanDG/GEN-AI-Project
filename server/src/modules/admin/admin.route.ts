import { Router } from 'express';
import { authorizeUser } from '../../middlewares/authorize-user.middleware';
import { requireAdmin } from '../../middlewares/role-authorization.middleware';
import { runPrismaStudio } from './admin.controller';

const router = Router();

router.get('/studio', authorizeUser, requireAdmin, runPrismaStudio);

export default router;
