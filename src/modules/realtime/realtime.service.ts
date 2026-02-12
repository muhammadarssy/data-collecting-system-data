import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import logger from '../../config/logger';
import mqttRealtimeService from '../mqtt/realtime.service';

class RealtimeService {
  // User-level tracking: userId -> Set of siteIds
  private userSubscriptions: Map<string, Set<string>> = new Map();

  /**
   * Subscribe a user to realtime data for a siteId
   */
  async subscribe(userId: string, siteId: string) {
    // Check if user is already subscribed
    const userSites = this.userSubscriptions.get(userId);
    if (userSites?.has(siteId)) {
      return { siteId, subscribed: true, message: 'Already subscribed' };
    }

    // Validate user has access to a project with this siteId
    const project = await prisma.project.findFirst({
      where: {
        siteId,
        OR: [
          { ownerId: userId },
          { projectUsers: { some: { userId } } },
        ],
      },
    });

    if (!project) {
      throw new AppError('Project not found or access denied for this site ID', 403);
    }

    // Subscribe at MQTT level (ref-counted)
    const success = await mqttRealtimeService.subscribeSite(siteId);
    if (!success) {
      throw new AppError('Failed to subscribe to MQTT realtime topic', 500);
    }

    // Track at user level
    if (!this.userSubscriptions.has(userId)) {
      this.userSubscriptions.set(userId, new Set());
    }
    this.userSubscriptions.get(userId)!.add(siteId);

    logger.info('User subscribed to realtime data', { userId, siteId });

    return { siteId, subscribed: true, message: 'Subscribed successfully' };
  }

  /**
   * Unsubscribe a user from realtime data for a siteId
   */
  async unsubscribe(userId: string, siteId: string) {
    const userSites = this.userSubscriptions.get(userId);

    if (!userSites?.has(siteId)) {
      throw new AppError('Not subscribed to this site ID', 400);
    }

    // Remove from user tracking
    userSites.delete(siteId);
    if (userSites.size === 0) {
      this.userSubscriptions.delete(userId);
    }

    // Unsubscribe at MQTT level (ref-counted)
    await mqttRealtimeService.unsubscribeSite(siteId);

    logger.info('User unsubscribed from realtime data', { userId, siteId });

    return { siteId, unsubscribed: true, message: 'Unsubscribed successfully' };
  }

  /**
   * Get all siteIds a user is subscribed to
   */
  getUserSubscriptions(userId: string): string[] {
    const userSites = this.userSubscriptions.get(userId);
    return userSites ? Array.from(userSites) : [];
  }

  /**
   * Unsubscribe a user from ALL siteIds
   */
  async unsubscribeAll(userId: string) {
    const userSites = this.userSubscriptions.get(userId);
    if (!userSites) return;

    for (const siteId of userSites) {
      await mqttRealtimeService.unsubscribeSite(siteId);
    }

    this.userSubscriptions.delete(userId);
    logger.info('User unsubscribed from all realtime data', { userId });
  }
}

export default new RealtimeService();
