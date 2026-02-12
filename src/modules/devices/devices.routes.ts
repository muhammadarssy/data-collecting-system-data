import { Router } from 'express';
import { DevicesController } from './devices.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateBody } from '../../shared/middleware/validation.middleware';
import { createDeviceSchema, updateDeviceSchema } from './devices.validation';

const router = Router();
const devicesController = new DevicesController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/devices
 * @desc    Create new device
 * @access  Private
 */
router.post('/', validateBody(createDeviceSchema), devicesController.createDevice);

/**
 * @route   GET /api/v1/devices
 * @desc    List devices by project
 * @access  Private
 * @query   projectId (required)
 */
router.get('/', devicesController.listDevices);

/**
 * @route   GET /api/v1/devices/:id
 * @desc    Get device by ID
 * @access  Private
 */
router.get('/:id', devicesController.getDevice);

/**
 * @route   PUT /api/v1/devices/:id
 * @desc    Update device
 * @access  Private
 */
router.put('/:id', validateBody(updateDeviceSchema), devicesController.updateDevice);

/**
 * @route   DELETE /api/v1/devices/:id
 * @desc    Delete device
 * @access  Private
 */
router.delete('/:id', devicesController.deleteDevice);

export default router;
