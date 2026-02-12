import { z } from 'zod';

export const queryHistorySchema = z.object({
  projectId: z.string().optional(),
  deviceId: z.string().optional(),
  deviceType: z.enum(['EHUB', 'CHINT', 'INVERTER']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type QueryHistoryInput = z.infer<typeof queryHistorySchema>;
