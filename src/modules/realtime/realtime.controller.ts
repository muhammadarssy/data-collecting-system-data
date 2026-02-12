import { Response } from 'express';
import realtimeService from './realtime.service';
import { sendSuccess } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { AuthRequest } from '../../shared/types';

export class RealtimeController {
  /**
   * POST /api/v1/realtime/subscribe
   * Subscribe to realtime data for a site
   */
  subscribe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await realtimeService.subscribe(req.user!.id, req.body.siteId);
    return sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/realtime/unsubscribe
   * Unsubscribe from realtime data for a site
   */
  unsubscribe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await realtimeService.unsubscribe(req.user!.id, req.body.siteId);
    return sendSuccess(res, result, result.message);
  });

  /**
   * GET /api/v1/realtime/subscriptions
   * List user's active realtime subscriptions
   */
  getSubscriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const subscriptions = realtimeService.getUserSubscriptions(req.user!.id);
    return sendSuccess(res, { subscriptions });
  });

  /**
   * POST /api/v1/realtime/unsubscribe-all
   * Unsubscribe from all realtime sites
   */
  unsubscribeAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    await realtimeService.unsubscribeAll(req.user!.id);
    return sendSuccess(res, null, 'Unsubscribed from all sites');
  });
}
