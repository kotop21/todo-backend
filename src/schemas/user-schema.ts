import { z } from "zod";

export const RegisterUserDto = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

export const LoginUserDto = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
});

export const LogoutUserDto = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export type RegisterUserDto = z.infer<typeof RegisterUserDto>;
export type LoginUserDto = z.infer<typeof LoginUserDto>;
export type LogoutUserDto = z.infer<typeof LogoutUserDto>;
