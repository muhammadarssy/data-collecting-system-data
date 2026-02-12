import { Response } from 'express';
import { DataService } from './data.service';
import { sendSuccess } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { AuthRequest } from '../../shared/types';

export class DataController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  /**
   * Query gateway history data
   */
  queryGatewayHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters = {
      ...req.query,
      userId: req.user!.id,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const data = await this.dataService.queryGatewayHistory(filters);
    return sendSuccess(res, data);
  });

  /**
   * Query chint history data
   */
  queryChintHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters = {
      ...req.query,
      userId: req.user!.id,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const data = await this.dataService.queryChintHistory(filters);
    return sendSuccess(res, data);
  });

  /**
   * Query inverter battery history data
   */
  queryInverterBatteryHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters = {
      ...req.query,
      userId: req.user!.id,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const data = await this.dataService.queryInverterBatteryHistory(filters);
    return sendSuccess(res, data);
  });

  /**
   * Get latest device data
   */
  getLatestDeviceData = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.dataService.getLatestDeviceData(req.params.deviceId, req.user!.id);
    return sendSuccess(res, data);
  });
}
