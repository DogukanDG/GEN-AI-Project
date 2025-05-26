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
 * IMPORT ROUTES
 */

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

// TODO: Add Global error handler after routes
// app.use(handleError);

const server = app.listen(process.env.PORT);
console.log('Server is running');

// TODO: Add cluster for performance
// TODO: Add gracefully shutdown
