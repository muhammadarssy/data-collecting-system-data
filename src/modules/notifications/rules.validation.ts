import { z } from 'zod';
import { NotificationRuleType } from '@prisma/client';

/**
 * Validation schema for creating a notification rule
 */
export const createRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    deviceId: z.string().cuid('Invalid device ID'),
    ruleType: z.nativeEnum(NotificationRuleType),
    field: z.string().min(1, 'Field is required'),
    operator: z.enum(['>', '<', '>=', '<=', '==', '!=']).optional(),
    value: z.number().optional(),
    expression: z.string().max(1000).optional(),
    isActive: z.boolean().default(true),
  }).refine(
    (data) => {
      // THRESHOLD rules require operator and value
      if (data.ruleType === 'THRESHOLD') {
        return data.operator && data.value !== undefined;
      }
      // CUSTOM_EXPRESSION rules require expression
      if (data.ruleType === 'CUSTOM_EXPRESSION') {
        return data.expression && data.expression.length > 0;
      }
      return true;
    },
    {
      message: 'Invalid rule configuration for the specified rule type',
    }
  ),
});

/**
 * Validation schema for updating a notification rule
 */
export const updateRuleSchema = z.object({
  params: z.object({
    ruleId: z.string().cuid('Invalid rule ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    ruleType: z.nativeEnum(NotificationRuleType).optional(),
    field: z.string().min(1).optional(),
    operator: z.enum(['>', '<', '>=', '<=', '==', '!=']).optional(),
    value: z.number().optional(),
    expression: z.string().max(1000).optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Validation schema for deleting a notification rule
 */
export const deleteRuleSchema = z.object({
  params: z.object({
    ruleId: z.string().cuid('Invalid rule ID'),
  }),
});

/**
 * Validation schema for getting rules by device
 */
export const getRulesByDeviceSchema = z.object({
  params: z.object({
    deviceId: z.string().cuid('Invalid device ID'),
  }),
});

/**
 * Validation schema for getting rules by project
 */
export const getRulesByProjectSchema = z.object({
  params: z.object({
    projectId: z.string().cuid('Invalid project ID'),
  }),
});

/**
 * Validation schema for getting a single rule
 */
export const getRuleSchema = z.object({
  params: z.object({
    ruleId: z.string().cuid('Invalid rule ID'),
  }),
});

/**
 * Validation schema for notifications list
 */
export const getNotificationsSchema = z.object({
  query: z.object({
    status: z.enum(['READ', 'UNREAD', 'ALL']).default('ALL'),
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  }),
});

/**
 * Validation schema for marking notification as read
 */
export const markAsReadSchema = z.object({
  params: z.object({
    notificationId: z.string().cuid('Invalid notification ID'),
  }),
});
