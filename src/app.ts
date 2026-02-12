import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware';
import { requestLogger } from './shared/middleware/logger.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import projectsRoutes from './modules/projects/projects.routes';
import devicesRoutes from './modules/devices/devices.routes';
import dataRoutes from './modules/data/data.routes';
import realtimeRoutes from './modules/realtime/realtime.routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
const apiPrefix = config.app.apiPrefix;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, usersRoutes);
app.use(`${apiPrefix}/projects`, projectsRoutes);
app.use(`${apiPrefix}/devices`, devicesRoutes);
app.use(`${apiPrefix}/data`, dataRoutes);
app.use(`${apiPrefix}/realtime`, realtimeRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
