import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sseManager from './sse.manager';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import logger from '../../config/logger';

class SSEController {
  /**
   * Establish SSE connection
   * GET /api/v1/sse/connect
   */
  connect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      // Get user's projects
      const userProjects = await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { projectUsers: { some: { userId } } },
          ],
        },
        select: {
          id: true,
        },
      });

      const projectIds = userProjects.map((p) => p.id);

      if (projectIds.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'No projects accessible for SSE connection',
        });
      }

      // Generate unique connection ID
      const connectionId = uuidv4();

      // Add SSE connection
      sseManager.addConnection(connectionId, userId, res, projectIds);

      logger.info('SSE connection request processed', {
        userId,
        connectionId,
        projectCount: projectIds.length,
      });

      // The response is now managed by SSE manager
      // Do not send any other response
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get SSE connection statistics (admin only)
   * GET /api/v1/sse/stats
   */
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = sseManager.getStats();

      return sendSuccess(res, stats, 'SSE statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's active SSE connections count
   * GET /api/v1/sse/my-connections
   */
  getMyConnections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const count = sseManager.getUserConnectionCount(userId);

      return sendSuccess(
        res,
        { count, userId },
        `You have ${count} active SSE connection(s)`
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new SSEController();
