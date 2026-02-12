import { Router } from 'express';
import { DataController } from './data.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();
const dataController = new DataController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/data/gateway
 * @desc    Query gateway history data
 * @access  Private
 * @query   projectId, deviceId, startDate, endDate, page, limit
 */
router.get('/gateway', dataController.queryGatewayHistory);

/**
 * @route   GET /api/v1/data/chint
 * @desc    Query chint history data
 * @access  Private
 * @query   projectId, deviceId, startDate, endDate, page, limit
 */
router.get('/chint', dataController.queryChintHistory);

/**
 * @route   GET /api/v1/data/inverter/battery
 * @desc    Query inverter battery history data
 * @access  Private
 * @query   projectId, deviceId, startDate, endDate, page, limit
 */
router.get('/inverter/battery', dataController.queryInverterBatteryHistory);

/**
 * @route   GET /api/v1/data/device/:deviceId/latest
 * @desc    Get latest data for a device
 * @access  Private
 */
router.get('/device/:deviceId/latest', dataController.getLatestDeviceData);

export default router;
