import { Router } from 'express';
import { RealtimeController } from './realtime.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateBody } from '../../shared/middleware/validation.middleware';
import { subscribeSchema, unsubscribeSchema } from './realtime.validation';

const router = Router();
const realtimeController = new RealtimeController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/realtime/subscribe
 * @desc    Subscribe to realtime data for a site
 * @access  Private
 */
router.post('/subscribe', validateBody(subscribeSchema), realtimeController.subscribe);

/**
 * @route   POST /api/v1/realtime/unsubscribe
 * @desc    Unsubscribe from realtime data for a site
 * @access  Private
 */
router.post('/unsubscribe', validateBody(unsubscribeSchema), realtimeController.unsubscribe);

/**
 * @route   GET /api/v1/realtime/subscriptions
 * @desc    List user's active realtime subscriptions
 * @access  Private
 */
router.get('/subscriptions', realtimeController.getSubscriptions);

/**
 * @route   POST /api/v1/realtime/unsubscribe-all
 * @desc    Unsubscribe from all realtime sites
 * @access  Private
 */
router.post('/unsubscribe-all', realtimeController.unsubscribeAll);

export default router;
