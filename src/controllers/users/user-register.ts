import type { Request, Response } from 'express';
import { createUser } from "../../service/users/database/user-register.js";
import { UserData } from "../../schemas/user-schema.js";
import { ZodError } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = UserData.parse(req.body);
    const result = await createUser(validatedData);

    return res.status(200).json({
      status: 'success',
      message: result.message,
    });

  } catch (err: any) {
    // Если ошибка валидации через Zod
    if (err instanceof ZodError) {
      const errors = err.issues.reduce((acc, curr) => {
        if (curr.path && curr.path[0]) {
          acc[curr.path[0] as string] = curr.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors,
        timestamp: new Date(),
      });
    }

    // Если это ошибка, которую хотим вернуть как 400
    if (err.message && err.message.includes('some condition')) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }

    // Все остальные неожиданные ошибки → 500
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
