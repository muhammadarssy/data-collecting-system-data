import { ParsedMqttTopic } from '../types';

/**
 * Parse MQTT topic into structured data
 * Format: data/<site_id>/<type_data>/<device_id>/<devices>/<sn_gateway>
 * Example: data/mhsj3jqn0lok167x4buu/history/mhsikjck/system/7011957300020111049
 */
export function parseMqttTopic(topic: string): ParsedMqttTopic | null {
  const parts = topic.split('/');

  if (parts.length !== 6 || parts[0] !== 'data') {
    return null;
  }

  return {
    prefix: parts[0],
    siteId: parts[1],
    typeData: parts[2], // 'history' or 'realtime'
    deviceId: parts[3],
    deviceType: parts[4], // 'ehub', 'chint', 'battery1', 'inverter1', etc.
    snGateway: parts[5],
  };
}

/**
 * Build MQTT topic from components
 */
export function buildMqttTopic(
  siteId: string,
  typeData: 'history' | 'realtime',
  deviceId: string,
  deviceType: string,
  snGateway: string
): string {
  return `data/${siteId}/${typeData}/${deviceId}/${deviceType}/${snGateway}`;
}

/**
 * Build subscription pattern for a site
 */
export function buildSiteSubscriptionPattern(
  siteId: string,
  typeData?: 'history' | 'realtime'
): string {
  if (typeData) {
    return `data/${siteId}/${typeData}/#`;
  }
  return `data/${siteId}/#`;
}
