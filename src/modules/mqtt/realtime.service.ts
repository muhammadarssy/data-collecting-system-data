import mqtt from 'mqtt';
import config from '../../config';
import logger from '../../config/logger';
import queueManager from '../queue/queue.manager';
import { parseMqttTopic, buildSiteSubscriptionPattern } from '../../shared/utils/mqtt';
import { safeJsonParse } from '../../shared/utils/helpers';

class MqttRealtimeService {
  private client: mqtt.MqttClient | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  // Reference counting: siteId -> number of active subscribers
  private subscriptionRefCount: Map<string, number> = new Map();

  /**
   * Initialize and connect to MQTT broker
   */
  async connect() {
    try {
      this.client = mqtt.connect(config.mqtt.brokerUrl, {
        clientId: `${config.mqtt.clientId}-realtime`,
        username: config.mqtt.username,
        password: config.mqtt.password,
        reconnectPeriod: config.mqtt.reconnectPeriod,
        connectTimeout: config.mqtt.connectTimeout,
        clean: true,
      });

      this.setupEventHandlers();
      logger.info('MQTT Realtime Service connecting...');
    } catch (error) {
      logger.error('Failed to connect MQTT Realtime Service:', error);
      throw error;
    }
  }

  /**
   * Setup MQTT event handlers
   */
  private setupEventHandlers() {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('MQTT Realtime Service connected successfully');
      this.reconnectAttempts = 0;

      // Re-subscribe to all active siteIds after reconnect
      this.resubscribeAll();
    });

    this.client.on('message', async (topic, message) => {
      await this.handleMessage(topic, message);
    });

    this.client.on('error', (error) => {
      logger.error('MQTT Realtime Service error:', error);
    });

    this.client.on('close', () => {
      logger.warn('MQTT Realtime Service connection closed');
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      logger.info(`MQTT Realtime Service reconnecting... (Attempt ${this.reconnectAttempts})`);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('MQTT Realtime Service max reconnect attempts reached');
        this.client?.end();
      }
    });

    this.client.on('offline', () => {
      logger.warn('MQTT Realtime Service is offline');
    });
  }

  /**
   * Re-subscribe to all active siteIds (after reconnect)
   */
  private resubscribeAll() {
    if (!this.client || this.subscriptionRefCount.size === 0) return;

    for (const siteId of this.subscriptionRefCount.keys()) {
      const pattern = buildSiteSubscriptionPattern(siteId, 'realtime');
      this.client.subscribe(pattern, { qos: 1 }, (err) => {
        if (err) {
          logger.error('Failed to re-subscribe to realtime topic:', { siteId, error: err });
        } else {
          logger.info(`Re-subscribed to: ${pattern}`);
        }
      });
    }
  }

  /**
   * Subscribe to realtime data for a siteId
   */
  async subscribeSite(siteId: string): Promise<boolean> {
    if (!this.client) {
      logger.error('MQTT Realtime Service not connected');
      return false;
    }

    const currentCount = this.subscriptionRefCount.get(siteId) || 0;

    if (currentCount === 0) {
      // First subscriber for this siteId - subscribe to MQTT
      const pattern = buildSiteSubscriptionPattern(siteId, 'realtime');

      return new Promise((resolve) => {
        this.client!.subscribe(pattern, { qos: 1 }, (err) => {
          if (err) {
            logger.error('Failed to subscribe to realtime topic:', { siteId, error: err });
            resolve(false);
          } else {
            this.subscriptionRefCount.set(siteId, 1);
            logger.info(`Subscribed to realtime: ${pattern}`);
            resolve(true);
          }
        });
      });
    }

    // Already subscribed at MQTT level, just increment ref count
    this.subscriptionRefCount.set(siteId, currentCount + 1);
    return true;
  }

  /**
   * Unsubscribe from realtime data for a siteId
   */
  async unsubscribeSite(siteId: string): Promise<boolean> {
    const currentCount = this.subscriptionRefCount.get(siteId) || 0;

    if (currentCount <= 0) {
      return false;
    }

    if (currentCount === 1) {
      // Last subscriber - unsubscribe from MQTT
      this.subscriptionRefCount.delete(siteId);

      if (!this.client) return true;

      const pattern = buildSiteSubscriptionPattern(siteId, 'realtime');

      return new Promise((resolve) => {
        this.client!.unsubscribe(pattern, (err) => {
          if (err) {
            logger.error('Failed to unsubscribe from realtime topic:', { siteId, error: err });
            resolve(false);
          } else {
            logger.info(`Unsubscribed from realtime: ${pattern}`);
            resolve(true);
          }
        });
      });
    }

    // Other subscribers still active, just decrement ref count
    this.subscriptionRefCount.set(siteId, currentCount - 1);
    return true;
  }

  /**
   * Get all active MQTT-level subscriptions
   */
  getActiveSubscriptions(): { siteId: string; refCount: number }[] {
    const subscriptions: { siteId: string; refCount: number }[] = [];
    for (const [siteId, refCount] of this.subscriptionRefCount) {
      subscriptions.push({ siteId, refCount });
    }
    return subscriptions;
  }

  /**
   * Handle incoming MQTT message
   */
  private async handleMessage(topic: string, message: Buffer) {
    try {
      logger.debug('Received realtime MQTT message', {
        topic,
        messageSize: message.length,
      });

      const parsedTopic = parseMqttTopic(topic);

      if (!parsedTopic) {
        logger.warn('Invalid MQTT topic format (realtime)', {
          topic,
          expected: 'data/<site_id>/<type_data>/<device_id>/<devices>/<sn_gateway>',
        });
        return;
      }

      // Only process realtime data
      if (parsedTopic.typeData !== 'realtime') {
        logger.debug('Skipping non-realtime message', {
          topic,
          typeData: parsedTopic.typeData,
        });
        return;
      }

      const payload = safeJsonParse(message.toString());

      if (!payload) {
        logger.warn('Invalid JSON payload in realtime MQTT message', {
          topic,
          messagePreview: message.toString().substring(0, 100),
        });
        return;
      }

      // Add to realtime queue for processing
      await queueManager.addRealtimeJob({
        topic,
        parsedTopic,
        payload,
        timestamp: new Date(),
      });

      logger.debug('Realtime MQTT message queued for processing', {
        topic,
        deviceId: parsedTopic.deviceId,
        siteId: parsedTopic.siteId,
        deviceType: parsedTopic.deviceType,
      });
    } catch (error) {
      logger.error('Error handling realtime MQTT message', {
        topic,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Disconnect from MQTT broker
   */
  async disconnect() {
    if (this.client) {
      this.client.end();
      this.subscriptionRefCount.clear();
      logger.info('MQTT Realtime Service disconnected');
    }
  }
}

export default new MqttRealtimeService();
