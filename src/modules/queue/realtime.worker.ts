import { Job } from 'bull';
import logger from '../../config/logger';
import { RealtimeQueueData } from '../../shared/types';

/**
 * Process realtime data jobs
 * Phase 9: Basic logging/validation
 * Phase 13: Will add notification rule evaluation
 * Phase 14: Will add SSE broadcasting
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

    logger.info('Realtime data received', {
      siteId: parsedTopic.siteId,
      deviceId: parsedTopic.deviceId,
      deviceType: parsedTopic.deviceType,
      snGateway: parsedTopic.snGateway,
      payloadKeys: Object.keys(payload),
      timestamp,
    });

    // TODO Phase 13: Evaluate notification rules
    // TODO Phase 14: Broadcast to SSE clients
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
