import { Response } from 'express';
import logger from '../../config/logger';

interface SSEConnection {
  userId: string;
  response: Response;
  projectIds: string[];
  connectedAt: Date;
}

/**
 * SSE Connection Manager
 * Manages Server-Sent Events connections for real-time notifications
 */
class SSEManager {
  // Map of connectionId -> SSEConnection
  private connections: Map<string, SSEConnection> = new Map();

  // Map of userId -> Set of connectionIds (for multi-device support)
  private userConnections: Map<string, Set<string>> = new Map();

  /**
   * Add a new SSE connection
   */
  addConnection(
    connectionId: string,
    userId: string,
    response: Response,
    projectIds: string[]
  ): void {
    // Setup SSE headers
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for nginx
    });

    // Send initial connection message
    this.sendEvent(response, 'connected', {
      message: 'SSE connection established',
      timestamp: new Date().toISOString(),
    });

    // Store connection
    const connection: SSEConnection = {
      userId,
      response,
      projectIds,
      connectedAt: new Date(),
    };

    this.connections.set(connectionId, connection);

    // Track user connections
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);

    logger.info('SSE connection established', {
      connectionId,
      userId,
      projectIds,
      totalConnections: this.connections.size,
    });

    // Setup connection cleanup on close
    response.on('close', () => {
      this.removeConnection(connectionId);
    });

    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
      if (this.connections.has(connectionId)) {
        this.sendEvent(response, 'heartbeat', {
          timestamp: new Date().toISOString(),
        });
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);

    if (connection) {
      const { userId } = connection;

      // Remove from connections map
      this.connections.delete(connectionId);

      // Remove from user connections
      const userConns = this.userConnections.get(userId);
      if (userConns) {
        userConns.delete(connectionId);
        if (userConns.size === 0) {
          this.userConnections.delete(userId);
        }
      }

      logger.info('SSE connection closed', {
        connectionId,
        userId,
        totalConnections: this.connections.size,
      });
    }
  }

  /**
   * Send event to a specific response
   */
  private sendEvent(response: Response, event: string, data: any): void {
    try {
      response.write(`event: ${event}\n`);
      response.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      logger.error('Error sending SSE event', {
        event,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Broadcast realtime data to all connections subscribed to a project
   */
  broadcastRealtimeData(
    projectId: string,
    deviceId: string,
    deviceType: string,
    payload: any
  ): void {
    let sentCount = 0;

    for (const [connectionId, connection] of this.connections) {
      // Check if connection is subscribed to this project
      if (connection.projectIds.includes(projectId)) {
        this.sendEvent(connection.response, 'realtime-data', {
          projectId,
          deviceId,
          deviceType,
          payload,
          timestamp: new Date().toISOString(),
        });
        sentCount++;
      }
    }

    if (sentCount > 0) {
      logger.debug('Realtime data broadcasted', {
        projectId,
        deviceId,
        recipientCount: sentCount,
      });
    }
  }

  /**
   * Send notification to specific user
   */
  sendNotificationToUser(
    userId: string,
    notification: {
      id: string;
      title: string;
      message: string;
      ruleId: string;
      data?: any;
      createdAt: string;
    }
  ): void {
    const userConns = this.userConnections.get(userId);

    if (!userConns || userConns.size === 0) {
      logger.debug('No active SSE connections for user', { userId });
      return;
    }

    let sentCount = 0;

    for (const connectionId of userConns) {
      const connection = this.connections.get(connectionId);
      if (connection) {
        this.sendEvent(connection.response, 'notification', notification);
        sentCount++;
      }
    }

    logger.info('Notification sent via SSE', {
      userId,
      notificationId: notification.id,
      connectionCount: sentCount,
    });
  }

  /**
   * Broadcast notification to all users with access to a project
   */
  broadcastNotification(
    userIds: string[],
    notification: {
      id: string;
      title: string;
      message: string;
      ruleId: string;
      data?: any;
      createdAt: string;
    }
  ): void {
    for (const userId of userIds) {
      this.sendNotificationToUser(userId, notification);
    }
  }

  /**
   * Get active connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get active connections for a user
   */
  getUserConnectionCount(userId: string): number {
    return this.userConnections.get(userId)?.size || 0;
  }

  /**
   * Get all active user IDs
   */
  getActiveUserIds(): string[] {
    return Array.from(this.userConnections.keys());
  }

  /**
   * Update project subscriptions for a connection
   */
  updateProjectSubscriptions(connectionId: string, projectIds: string[]): boolean {
    const connection = this.connections.get(connectionId);

    if (!connection) {
      return false;
    }

    connection.projectIds = projectIds;

    logger.info('SSE connection project subscriptions updated', {
      connectionId,
      projectIds,
    });

    return true;
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    totalConnections: number;
    totalUsers: number;
    connections: Array<{
      connectionId: string;
      userId: string;
      projectIds: string[];
      connectedAt: string;
      duration: number;
    }>;
  } {
    const connections = [];

    for (const [connectionId, connection] of this.connections) {
      connections.push({
        connectionId,
        userId: connection.userId,
        projectIds: connection.projectIds,
        connectedAt: connection.connectedAt.toISOString(),
        duration: Date.now() - connection.connectedAt.getTime(),
      });
    }

    return {
      totalConnections: this.connections.size,
      totalUsers: this.userConnections.size,
      connections,
    };
  }

  /**
   * Close all connections (for graceful shutdown)
   */
  closeAllConnections(): void {
    logger.info('Closing all SSE connections', {
      count: this.connections.size,
    });

    for (const [connectionId, connection] of this.connections) {
      this.sendEvent(connection.response, 'server-shutdown', {
        message: 'Server is shutting down',
        timestamp: new Date().toISOString(),
      });
      connection.response.end();
    }

    this.connections.clear();
    this.userConnections.clear();
  }
}

export default new SSEManager();
