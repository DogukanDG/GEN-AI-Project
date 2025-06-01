import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

/**
 * IMPORT DATABASE
 */
import prisma from './src/configs/database';

/**
 * IMPORT ROUTES
 */
import authRoutes from './src/modules/auth/auth.route';
import userRoutes from './src/modules/user/user.route';
import roomFeatureRoutes from './src/modules/roomFeature/roomFeature.route';
import { handleError } from './src/middlewares/error-handler.middleware';

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: 'Too many requests!',
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'otps.log'), {
  flags: 'a',
});

const shouldCompress = (req: express.Request, res: express.Response) => {
  if (req.headers['x-no-compression']) {
    return false;
  }

  return compression.filter(req, res);
};

app.use(
  compression({
    threshold: 1,
    filter: shouldCompress,
  })
);
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(morgan('tiny', { stream: accessLogStream }));

/**
 * USE ROUTES
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/room-features', roomFeatureRoutes);

app.use(handleError);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
  console.log(`📊 Health check available at http://localhost:${process.env.PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Process terminated');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Process terminated');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});
