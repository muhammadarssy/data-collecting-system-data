import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// MQTT Types
export interface MqttMessage {
  topic: string;
  payload: any;
  timestamp: Date;
}

export interface ParsedMqttTopic {
  prefix: string;        // 'data'
  siteId: string;        // site_id
  typeData: string;      // 'history' or 'realtime'
  deviceId: string;      // device_id
  deviceType: string;    // 'ehub', 'chint', 'battery', 'inverter', etc.
  snGateway: string;     // serial number gateway
}

// Queue Job Data Types
export interface HistoryQueueData {
  topic: string;
  parsedTopic: ParsedMqttTopic;
  payload: any;
  timestamp: Date;
}

export interface RealtimeQueueData {
  topic: string;
  parsedTopic: ParsedMqttTopic;
  payload: any;
  timestamp: Date;
}

// Notification Types
export interface NotificationPayload {
  userId: string;
  ruleId: string;
  title: string;
  message: string;
  data?: any;
}

// SSE Types
export interface SSEClient {
  userId: string;
  response: any;
  projectIds: string[];
}

// Filter Types
export interface DataQueryFilters {
  deviceId?: string;
  projectId?: string;
  deviceType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
