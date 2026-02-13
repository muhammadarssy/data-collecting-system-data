import app from './app';
import config from './config';
import logger from './config/logger';
import prisma from './config/database';
import mqttHistoryCollector from './modules/mqtt/history.collector';
import queueManager from './modules/queue/queue.manager';
import { processHistoryData } from './modules/queue/history.worker';
import mqttRealtimeService from './modules/mqtt/realtime.service';
import { processRealtimeData } from './modules/queue/realtime.worker';
import sseManager from './modules/notifications/sse.manager';

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start MQTT History Collector
    await mqttHistoryCollector.connect();

    // Start MQTT Realtime Service
    await mqttRealtimeService.connect();

    // Start Queue Workers
    queueManager.historyQueue.process(config.queue.concurrency, processHistoryData);
    queueManager.realtimeQueue.process(config.queue.concurrency, processRealtimeData);
    logger.info('Queue workers started');

    // Start Express server
    const server = app.listen(config.app.port, () => {
      logger.info(`Server running on port ${config.app.port} in ${config.app.env} mode`);
      logger.info(`API available at http://localhost:${config.app.port}${config.app.apiPrefix}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        // Close SSE connections
        sseManager.closeAllConnections();
        logger.info('SSE connections closed');

        // Close MQTT connections
        await mqttHistoryCollector.disconnect();
        await mqttRealtimeService.disconnect();

        // Close queue manager
        await queueManager.close();

        // Close database connection
        await prisma.$disconnect();
        logger.info('Database disconnected');

        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
