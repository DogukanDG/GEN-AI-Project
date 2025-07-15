import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address as key
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// More restrictive rate limiter for search endpoints
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 search requests per minute
  message: {
    success: false,
    error: 'Too many search requests, please wait a moment before searching again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// Rate limiter for reservation endpoints
export const reservationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 reservation requests per minute
  message: {
    success: false,
    error: 'Too many reservation requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});
