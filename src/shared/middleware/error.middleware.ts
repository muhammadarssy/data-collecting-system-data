import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return sendError(res, 'Database error occurred', 400);
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return sendError(res, 'Validation error', 400);
  }

  // Default error
  return sendError(res, 'Internal server error', 500);
}

/**
 * Handle 404 errors
 */
export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
