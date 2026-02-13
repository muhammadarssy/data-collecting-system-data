import { Router } from 'express';
import notificationsController from './notifications.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v1/notifications
 * Get user notifications with pagination and filtering
 */
router.get('/', notificationsController.getNotifications);

/**
 * GET /api/v1/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', notificationsController.getUnreadCount);

/**
 * GET /api/v1/notifications/:notificationId
 * Get a single notification
 */
router.get('/:notificationId', notificationsController.getNotification);

/**
 * PATCH /api/v1/notifications/:notificationId/read
 * Mark notification as read
 */
router.patch('/:notificationId/read', notificationsController.markAsRead);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', notificationsController.markAllAsRead);

/**
 * DELETE /api/v1/notifications/:notificationId
 * Delete a notification
 */
router.delete('/:notificationId', notificationsController.deleteNotification);

/**
 * DELETE /api/v1/notifications/read
 * Delete all read notifications
 */
router.delete('/read', notificationsController.deleteAllRead);

export default router;
