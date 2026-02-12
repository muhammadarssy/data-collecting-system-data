import { z } from 'zod';
import { DeviceType } from '@prisma/client';

export const createDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required').max(100),
  deviceType: z.nativeEnum(DeviceType, { errorMap: () => ({ message: 'Invalid device type' }) }),
  name: z.string().min(1, 'Device name is required').max(200),
  description: z.string().max(1000).optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  snGateway: z.string().max(100).optional(),
});

export const updateDeviceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  snGateway: z.string().max(100).optional(),
});

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
