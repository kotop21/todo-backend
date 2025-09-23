// session-schema.ts
import { z } from "zod";

export const SessionData = z.object({
  id: z.number().optional(),
  userId: z.number({
    message: "userId is required",
  }),
  refreshToken: z
    .string({
      message: "refreshToken is required",
    })
    .min(1, { message: "refreshToken cannot be empty" }),
  createdAt: z
    .date({
      message: "createdAt is required",
    }),
  expiresAt: z
    .date({
      message: "expiresAt is required",
    })
    .refine((date) => date > new Date(), {
      message: "expiresAt must be in the future",
    }),
});

export type SessionData = z.infer<typeof SessionData>;
