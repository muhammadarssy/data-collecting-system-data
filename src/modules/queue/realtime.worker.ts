import { Job } from 'bull';
import logger from '../../config/logger';
import prisma from '../../config/database';
import { RealtimeQueueData } from '../../shared/types';
import ruleEvaluator from '../notifications/rule-evaluator';
import notificationsService from '../notifications/notifications.service';
import sseManager from '../notifications/sse.manager';

/**
 * Process realtime data jobs
 * Phase 9: Basic logging/validation ✅
 * Phase 13: Notification rule evaluation ✅
 * Phase 14: SSE broadcasting ✅
 */
export async function processRealtimeData(job: Job<RealtimeQueueData>) {
  const { topic, parsedTopic, payload, timestamp } = job.data;

  try {
    logger.debug('Processing realtime data', {
      jobId: job.id,
      topic,
      siteId: parsedTopic.siteId,
      deviceId: parsedTopic.deviceId,
      deviceType: parsedTopic.deviceType,
      timestamp,
    });

    // Find device by deviceId from topic and siteId
    const device = await prisma.device.findFirst({
      where: {
        deviceId: parsedTopic.deviceId,
        project: {
          siteId: parsedTopic.siteId,
        },
      },
      include: {
        project: true,
      },
    });

    if (!device) {
      logger.warn('Device not found for realtime data', {
        deviceId: parsedTopic.deviceId,
        siteId: parsedTopic.siteId,
      });
      return; // Don't fail the job, just skip processing
    }

    logger.info('Realtime data received', {
      siteId: parsedTopic.siteId,
      deviceId: parsedTopic.deviceId,
      deviceType: parsedTopic.deviceType,
      snGateway: parsedTopic.snGateway,
      payloadKeys: Object.keys(payload),
      timestamp,
    });

    // Phase 14: Broadcast realtime data to SSE clients
    sseManager.broadcastRealtimeData(
      device.projectId,
      parsedTopic.deviceId,
      parsedTopic.deviceType,
      payload
    );

    // Phase 13: Evaluate notification rules
    const deviceStatus = {
      isOnline: device.isOnline,
      lastSeenAt: device.lastSeenAt || undefined,
    };

    const triggeredRules = await ruleEvaluator.evaluateRulesForDevice(
      device.id,
      payload,
      deviceStatus
    );

    if (triggeredRules.length > 0) {
      logger.info('Notification rules triggered', {
        deviceId: device.id,
        triggeredCount: triggeredRules.length,
      });

      // Create notifications for each triggered rule
      for (const { rule, result } of triggeredRules) {
        const title = `Alert: ${rule.name}`;
        const message = result.message || 'Notification rule triggered';

        const notificationData = {
          ruleType: rule.ruleType,
          field: rule.field,
          deviceId: device.deviceId,
          deviceName: device.name,
          deviceType: device.deviceType,
          siteId: parsedTopic.siteId,
          actualValue: result.actualValue,
          expectedValue: result.expectedValue,
          timestamp: timestamp.toISOString(),
        };

        // Create notifications for all project users
        await notificationsService.createNotificationForProjectUsers(
          device.projectId,
          rule.id,
          title,
          message,
          notificationData
        );

        logger.info('Notifications created for rule', {
          ruleId: rule.id,
          ruleName: rule.name,
          deviceId: device.id,
        });
      }
    }
  } catch (error) {
    logger.error('Error processing realtime data', {
      jobId: job.id,
      topic,
      siteId: parsedTopic.siteId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error; // Will trigger Bull retry
  }
}
