import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send success response
 */
export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendError(res: Response, error: string, statusCode = 400) {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
}

/**
 * Send created response
 */
export function sendCreated<T>(res: Response, data: T, message = 'Resource created successfully') {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response) {
  return res.status(204).send();
}
