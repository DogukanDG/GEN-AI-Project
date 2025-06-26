"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * IMPORT DATABASE
 */
const database_1 = __importDefault(require("./src/configs/database"));
/**
 * IMPORT ROUTES
 */
const auth_route_1 = __importDefault(require("./src/modules/auth/auth.route"));
const user_route_1 = __importDefault(require("./src/modules/user/user.route"));
const error_handler_middleware_1 = require("./src/middlewares/error-handler.middleware");
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    message: 'Too many requests!',
});
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'otps.log'), {
    flags: 'a',
});
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression_1.default.filter(req, res);
};
app.use((0, compression_1.default)({
    threshold: 1,
    filter: shouldCompress,
}));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(limiter);
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('tiny', { stream: accessLogStream }));
/**
 * USE ROUTES
 */
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/users', user_route_1.default);
app.use(error_handler_middleware_1.handleError);
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await database_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
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
            await database_1.default.$disconnect();
            console.log('Process terminated');
            process.exit(0);
        }
        catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
        try {
            await database_1.default.$disconnect();
            console.log('Process terminated');
            process.exit(0);
        }
        catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
});
