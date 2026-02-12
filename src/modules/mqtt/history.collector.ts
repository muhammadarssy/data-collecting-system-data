import mqtt from 'mqtt';
import config from '../../config';
import logger from '../../config/logger';
import queueManager from '../queue/queue.manager';
import { parseMqttTopic } from '../../shared/utils/mqtt';
import { safeJsonParse } from '../../shared/utils/helpers';
import { MQTT_TOPICS } from '../../shared/constants';

class MqttHistoryCollector {
  private client: mqtt.MqttClient | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  /**
   * Initialize and connect to MQTT broker
   */
  async connect() {
    try {
      this.client = mqtt.connect(config.mqtt.brokerUrl, {
        clientId: `${config.mqtt.clientId}-history`,
        username: config.mqtt.username,
        password: config.mqtt.password,
        reconnectPeriod: config.mqtt.reconnectPeriod,
        connectTimeout: config.mqtt.connectTimeout,
        clean: true,
      });

      this.setupEventHandlers();
      logger.info('MQTT History Collector connecting...');
    } catch (error) {
      logger.error('Failed to connect MQTT History Collector:', error);
      throw error;
    }
  }

  /**
   * Setup MQTT event handlers
   */
  private setupEventHandlers() {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('MQTT History Collector connected successfully');
      this.reconnectAttempts = 0;

      // Subscribe to all history topics
      this.client!.subscribe(MQTT_TOPICS.HISTORY_ALL, { qos: 1 }, (err) => {
        if (err) {
          logger.error('Failed to subscribe to history topics:', err);
        } else {
          logger.info(`Subscribed to: ${MQTT_TOPICS.HISTORY_ALL}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      await this.handleMessage(topic, message);
    });

    this.client.on('error', (error) => {
      logger.error('MQTT History Collector error:', error);
    });

    this.client.on('close', () => {
      logger.warn('MQTT History Collector connection closed');
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      logger.info(`MQTT History Collector reconnecting... (Attempt ${this.reconnectAttempts})`);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('Max reconnect attempts reached');
        this.client?.end();
      }
    });

    this.client.on('offline', () => {
      logger.warn('MQTT History Collector is offline');
    });
  }

  /**
   * Handle incoming MQTT message
   */
  private async handleMessage(topic: string, message: Buffer) {
    try {
      const parsedTopic = parseMqttTopic(topic);

      if (!parsedTopic) {
        logger.warn(`Invalid topic format: ${topic}`);
        return;
      }

      // Only process history data
      if (parsedTopic.typeData !== 'history') {
        return;
      }

      const payload = safeJsonParse(message.toString());

      if (!payload) {
        logger.warn(`Invalid JSON payload for topic: ${topic}`);
        return;
      }

      // Add to queue for processing
      await queueManager.addHistoryJob({
        topic,
        parsedTopic,
        payload,
        timestamp: new Date(),
      });

      logger.debug(`History data queued from topic: ${topic}`);
    } catch (error) {
      logger.error(`Error handling message from ${topic}:`, error);
    }
  }

  /**
   * Disconnect from MQTT broker
   */
  async disconnect() {
    if (this.client) {
      this.client.end();
      logger.info('MQTT History Collector disconnected');
    }
  }
}

export default new MqttHistoryCollector();
