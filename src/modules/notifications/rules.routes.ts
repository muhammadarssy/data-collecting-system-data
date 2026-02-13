import { Router } from 'express';
import rulesController from './rules.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/v1/rules
 * Create a new notification rule
 */
router.post('/', rulesController.createRule);

/**
 * GET /api/v1/rules/:ruleId
 * Get a single notification rule
 */
router.get('/:ruleId', rulesController.getRule);

/**
 * GET /api/v1/rules/device/:deviceId
 * Get all rules for a device
 */
router.get('/device/:deviceId', rulesController.getRulesByDevice);

/**
 * GET /api/v1/rules/project/:projectId
 * Get all rules for a project
 */
router.get('/project/:projectId', rulesController.getRulesByProject);

/**
 * PATCH /api/v1/rules/:ruleId
 * Update a notification rule
 */
router.patch('/:ruleId', rulesController.updateRule);

/**
 * DELETE /api/v1/rules/:ruleId
 * Delete a notification rule
 */
router.delete('/:ruleId', rulesController.deleteRule);

export default router;
