import Bull from 'bull';
import Redis from 'ioredis';
import config from '../../config';
import logger from '../../config/logger';
import { HistoryQueueData, RealtimeQueueData } from '../../shared/types';

class QueueManager {
  public historyQueue: Bull.Queue<HistoryQueueData>;
  public realtimeQueue: Bull.Queue<RealtimeQueueData>;
  private redisClient: Redis;

  constructor() {
    // Create Redis client for Bull
    this.redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    // Create History Queue
    this.historyQueue = new Bull<HistoryQueueData>(config.queue.historyName, {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
      defaultJobOptions: {
        attempts: config.queue.maxRetry,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 500, // Keep last 500 failed jobs
      },
    });

    // Create Realtime Queue
    this.realtimeQueue = new Bull<RealtimeQueueData>(config.queue.realtimeName, {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
      defaultJobOptions: {
        attempts: config.queue.maxRetry,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    this.setupEventListeners();
    logger.info('Queue Manager initialized');
  }

  private setupEventListeners() {
    // History Queue Events
    this.historyQueue.on('completed', (job) => {
      logger.debug(`History job ${job.id} completed`);
    });

    this.historyQueue.on('failed', (job, err) => {
      logger.error(`History job ${job?.id} failed:`, err);
    });

    // Realtime Queue Events
    this.realtimeQueue.on('completed', (job) => {
      logger.debug(`Realtime job ${job.id} completed`);
    });

    this.realtimeQueue.on('failed', (job, err) => {
      logger.error(`Realtime job ${job?.id} failed:`, err);
    });
  }

  async addHistoryJob(data: HistoryQueueData) {
    await this.historyQueue.add(data, {
      priority: 2, // Lower priority than realtime
    });
  }

  async addRealtimeJob(data: RealtimeQueueData) {
    await this.realtimeQueue.add(data, {
      priority: 1, // Higher priority
    });
  }

  async close() {
    await this.historyQueue.close();
    await this.realtimeQueue.close();
    await this.redisClient.quit();
    logger.info('Queue Manager closed');
  }
}

export default new QueueManager();
