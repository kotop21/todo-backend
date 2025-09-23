// user-schema.ts
import { z } from "zod";

export const UserData = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

export type UserData = z.infer<typeof UserData>;
