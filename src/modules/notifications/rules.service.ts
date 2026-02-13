import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { NotificationRuleType } from '@prisma/client';
import logger from '../../config/logger';

interface CreateRuleInput {
  name: string;
  description?: string;
  deviceId: string;
  ruleType: NotificationRuleType;
  field: string;
  operator?: string;
  value?: number;
  expression?: string;
  isActive?: boolean;
}

interface UpdateRuleInput {
  name?: string;
  description?: string;
  ruleType?: NotificationRuleType;
  field?: string;
  operator?: string;
  value?: number;
  expression?: string;
  isActive?: boolean;
}

class RulesService {
  /**
   * Create a new notification rule
   */
  async createRule(userId: string, input: CreateRuleInput) {
    // Check if device exists and user has access
    const device = await prisma.device.findUnique({
      where: { id: input.deviceId },
      include: {
        project: {
          include: {
            owner: true,
            projectUsers: true,
          },
        },
      },
    });

    if (!device) {
      throw new AppError('Device not found', 404);
    }

    // Check access rights
    const hasAccess =
      device.project.ownerId === userId ||
      device.project.projectUsers.some((pu) => pu.userId === userId);

    if (!hasAccess) {
      throw new AppError('Access denied to this device', 403);
    }

    const rule = await prisma.notificationRule.create({
      data: {
        name: input.name,
        description: input.description,
        deviceId: input.deviceId,
        projectId: device.projectId,
        ruleType: input.ruleType,
        field: input.field,
        operator: input.operator,
        value: input.value,
        expression: input.expression,
        isActive: input.isActive ?? true,
        createdById: userId,
      },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            name: true,
            deviceType: true,
          },
        },
      },
    });

    logger.info('Notification rule created', {
      ruleId: rule.id,
      deviceId: input.deviceId,
      ruleType: input.ruleType,
      userId,
    });

    return rule;
  }

  /**
   * Get a single rule by ID
   */
  async getRule(ruleId: string, userId: string) {
    const rule = await prisma.notificationRule.findUnique({
      where: { id: ruleId },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            name: true,
            deviceType: true,
          },
        },
        project: {
          include: {
            owner: true,
            projectUsers: true,
          },
        },
      },
    });

    if (!rule) {
      throw new AppError('Notification rule not found', 404);
    }

    // Check access rights
    const hasAccess =
      rule.project.ownerId === userId ||
      rule.project.projectUsers.some((pu) => pu.userId === userId);

    if (!hasAccess) {
      throw new AppError('Access denied to this rule', 403);
    }

    return rule;
  }

  /**
   * Get all rules for a device
   */
  async getRulesByDevice(deviceId: string, userId: string) {
    // Check if device exists and user has access
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        project: {
          include: {
            owner: true,
            projectUsers: true,
          },
        },
      },
    });

    if (!device) {
      throw new AppError('Device not found', 404);
    }

    // Check access rights
    const hasAccess =
      device.project.ownerId === userId ||
      device.project.projectUsers.some((pu) => pu.userId === userId);

    if (!hasAccess) {
      throw new AppError('Access denied to this device', 403);
    }

    const rules = await prisma.notificationRule.findMany({
      where: { deviceId },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            name: true,
            deviceType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rules;
  }

  /**
   * Get all rules for a project
   */
  async getRulesByProject(projectId: string, userId: string) {
    // Check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        projectUsers: true,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check access rights
    const hasAccess =
      project.ownerId === userId ||
      project.projectUsers.some((pu) => pu.userId === userId);

    if (!hasAccess) {
      throw new AppError('Access denied to this project', 403);
    }

    const rules = await prisma.notificationRule.findMany({
      where: { projectId },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            name: true,
            deviceType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rules;
  }

  /**
   * Update a notification rule
   */
  async updateRule(ruleId: string, userId: string, input: UpdateRuleInput) {
    // Get rule and check access
    await this.getRule(ruleId, userId);

    const updatedRule = await prisma.notificationRule.update({
      where: { id: ruleId },
      data: input,
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            name: true,
            deviceType: true,
          },
        },
      },
    });

    logger.info('Notification rule updated', {
      ruleId,
      userId,
      changes: Object.keys(input),
    });

    return updatedRule;
  }

  /**
   * Delete a notification rule
   */
  async deleteRule(ruleId: string, userId: string) {
    // Get rule and check access
    await this.getRule(ruleId, userId);

    await prisma.notificationRule.delete({
      where: { id: ruleId },
    });

    logger.info('Notification rule deleted', {
      ruleId,
      userId,
    });

    return { message: 'Notification rule deleted successfully' };
  }

  /**
   * Get active rules for a specific device (used by evaluation engine)
   */
  async getActiveRulesForDevice(deviceId: string) {
    return prisma.notificationRule.findMany({
      where: {
        deviceId,
        isActive: true,
      },
    });
  }
}

export default new RulesService();
