import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { NotificationStatus } from '@prisma/client';
import logger from '../../config/logger';
import { buildPaginatedResponse } from '../../shared/utils/pagination';
import sseManager from './sse.manager';

interface CreateNotificationInput {
  userId: string;
  ruleId: string;
  title: string;
  message: string;
  data?: any;
}

class NotificationsService {
  /**
   * Create a notification for a user
   */
  async createNotification(input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        ruleId: input.ruleId,
        title: input.title,
        message: input.message,
        data: input.data || {},
        status: NotificationStatus.UNREAD,
      },
      include: {
        rule: {
          select: {
            id: true,
            name: true,
            deviceId: true,
          },
        },
      },
    });

    logger.info('Notification created', {
      notificationId: notification.id,
      userId: input.userId,
      ruleId: input.ruleId,
    });

    // Broadcast notification via SSE
    sseManager.sendNotificationToUser(input.userId, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      ruleId: notification.ruleId,
      data: notification.data,
      createdAt: notification.createdAt.toISOString(),
    });

    return notification;
  }

  /**
   * Create notifications for all users with access to a project
   */
  async createNotificationForProjectUsers(
    projectId: string,
    ruleId: string,
    title: string,
    message: string,
    data?: any
  ) {
    // Get all users with access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectUsers: true,
      },
    });

    if (!project) {
      logger.warn('Project not found for notification', { projectId });
      return [];
    }

    // Create list of user IDs (owner + project users)
    const userIds = [
      project.ownerId,
      ...project.projectUsers.map((pu) => pu.userId),
    ];

    // Remove duplicates
    const uniqueUserIds = [...new Set(userIds)];

    // Create notifications for all users
    const notifications = await Promise.all(
      uniqueUserIds.map((userId) =>
        this.createNotification({
          userId,
          ruleId,
          title,
          message,
          data,
        })
      )
    );

    logger.info('Notifications created for project users', {
      projectId,
      userCount: uniqueUserIds.length,
      ruleId,
    });

    return notifications;
  }

  /**
   * Get user notifications with pagination and filtering
   */
  async getUserNotifications(
    userId: string,
    options: {
      status?: 'READ' | 'UNREAD' | 'ALL';
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { status = 'ALL', page = 1, limit = 20 } = options;

    // Build where clause
    const where: any = { userId };

    if (status !== 'ALL') {
      where.status = status === 'READ' ? NotificationStatus.READ : NotificationStatus.UNREAD;
    }

    // Get total count
    const total = await prisma.notification.count({ where });

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where,
      include: {
        rule: {
          select: {
            id: true,
            name: true,
            deviceId: true,
            device: {
              select: {
                id: true,
                name: true,
                deviceType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return buildPaginatedResponse(notifications, total, page, limit);
  }

  /**
   * Get a single notification
   */
  async getNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        rule: {
          select: {
            id: true,
            name: true,
            deviceId: true,
            device: {
              select: {
                id: true,
                name: true,
                deviceType: true,
              },
            },
          },
        },
      },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    // Check ownership
    if (notification.userId !== userId) {
      throw new AppError('Access denied to this notification', 403);
    }

    return notification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    // Check ownership first
    await this.getNotification(notificationId, userId);

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    logger.info('Notification marked as read', {
      notificationId,
      userId,
    });

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    logger.info('All notifications marked as read', {
      userId,
      count: result.count,
    });

    return { count: result.count };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
    });

    return { count };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    // Check ownership first
    await this.getNotification(notificationId, userId);

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    logger.info('Notification deleted', {
      notificationId,
      userId,
    });

    return { message: 'Notification deleted successfully' };
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string) {
    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        status: NotificationStatus.READ,
      },
    });

    logger.info('All read notifications deleted', {
      userId,
      count: result.count,
    });

    return { count: result.count };
  }
}

export default new NotificationsService();
