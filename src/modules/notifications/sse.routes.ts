import { Router } from 'express';
import sseController from './sse.controller';
import { authenticate, requireAdmin } from '../../shared/middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v1/sse/connect
 * Establish SSE connection for real-time updates
 */
router.get('/connect', sseController.connect);

/**
 * GET /api/v1/sse/my-connections
 * Get user's active SSE connection count
 */
router.get('/my-connections', sseController.getMyConnections);

/**
 * GET /api/v1/sse/stats
 * Get SSE statistics (admin only)
 */
router.get('/stats', requireAdmin, sseController.getStats);

export default router;
