import { Request, Response, NextFunction } from 'express';
import rulesService from './rules.service';
import { sendSuccess } from '../../shared/utils/response';

class RulesController {
  /**
   * Create a new notification rule
   */
  createRule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const rule = await rulesService.createRule(userId, req.body);

      return sendSuccess(res, rule, 'Notification rule created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a single notification rule
   */
  getRule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { ruleId } = req.params;

      const rule = await rulesService.getRule(ruleId, userId);

      return sendSuccess(res, rule, 'Notification rule retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all rules for a device
   */
  getRulesByDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { deviceId } = req.params;

      const rules = await rulesService.getRulesByDevice(deviceId, userId);

      return sendSuccess(
        res,
        rules,
        `Found ${rules.length} notification rule(s) for device`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all rules for a project
   */
  getRulesByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { projectId } = req.params;

      const rules = await rulesService.getRulesByProject(projectId, userId);

      return sendSuccess(
        res,
        rules,
        `Found ${rules.length} notification rule(s) for project`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a notification rule
   */
  updateRule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { ruleId } = req.params;

      const rule = await rulesService.updateRule(ruleId, userId, req.body);

      return sendSuccess(res, rule, 'Notification rule updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a notification rule
   */
  deleteRule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { ruleId } = req.params;

      const result = await rulesService.deleteRule(ruleId, userId);

      return sendSuccess(res, result, 'Notification rule deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default new RulesController();
