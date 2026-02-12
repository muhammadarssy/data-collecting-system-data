import { Response } from 'express';
import { DevicesService } from './devices.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { AuthRequest } from '../../shared/types';

export class DevicesController {
  private devicesService: DevicesService;

  constructor() {
    this.devicesService = new DevicesService();
  }

  /**
   * Create new device
   */
  createDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const device = await this.devicesService.createDevice(req.body, req.user!.id);
    return sendCreated(res, device, 'Device created successfully');
  });

  /**
   * Get device by ID
   */
  getDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const device = await this.devicesService.getDeviceById(req.params.id, req.user!.id);
    return sendSuccess(res, device);
  });

  /**
   * List devices by project
   */
  listDevices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = req.query.projectId as string;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const devices = await this.devicesService.listDevicesByProject(
      projectId,
      req.user!.id,
      page,
      limit
    );
    return sendSuccess(res, devices);
  });

  /**
   * Update device
   */
  updateDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const device = await this.devicesService.updateDevice(req.params.id, req.body, req.user!.id);
    return sendSuccess(res, device, 'Device updated successfully');
  });

  /**
   * Delete device
   */
  deleteDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.devicesService.deleteDevice(req.params.id, req.user!.id);
    return sendSuccess(res, result);
  });
}
