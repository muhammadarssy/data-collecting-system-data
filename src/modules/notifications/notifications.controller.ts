import { Request, Response, NextFunction } from 'express';
import notificationsService from './notifications.service';
import { sendSuccess } from '../../shared/utils/response';

class NotificationsController {
  /**
   * Get user notifications
   */
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status, page, limit } = req.query;

      const result = await notificationsService.getUserNotifications(userId, {
        status: status as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      return sendSuccess(
        res,
        result,
        `Found ${result.data.length} notification(s)`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single notification
   */
  async getNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;

      const notification = await notificationsService.getNotification(
        notificationId,
        userId
      );

      return sendSuccess(res, notification, 'Notification retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;

      const notification = await notificationsService.markAsRead(notificationId, userId);

      return sendSuccess(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await notificationsService.markAllAsRead(userId);

      return sendSuccess(
        res,
        result,
        `${result.count} notification(s) marked as read`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await notificationsService.getUnreadCount(userId);

      return sendSuccess(res, result, 'Unread count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;

      const result = await notificationsService.deleteNotification(
        notificationId,
        userId
      );

      return sendSuccess(res, result, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await notificationsService.deleteAllRead(userId);

      return sendSuccess(
        res,
        result,
        `${result.count} notification(s) deleted successfully`
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationsController();
