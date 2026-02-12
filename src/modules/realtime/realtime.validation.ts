import { z } from 'zod';

export const subscribeSchema = z.object({
  siteId: z
    .string()
    .min(1, 'Site ID is required')
    .max(100)
    .regex(/^[a-z0-9]+$/, 'Site ID must be lowercase alphanumeric'),
});

export const unsubscribeSchema = z.object({
  siteId: z
    .string()
    .min(1, 'Site ID is required')
    .max(100)
    .regex(/^[a-z0-9]+$/, 'Site ID must be lowercase alphanumeric'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
