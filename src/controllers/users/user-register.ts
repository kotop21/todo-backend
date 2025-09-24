import type { Request, Response } from 'express';
import { createUser } from "../../service/users/database/user-register.js";
import { RegisterUserDto } from "../../schemas/user-schema.js";
import { ZodError } from "zod";
import { createSession } from '../../service/users/database/user-session.js';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = RegisterUserDto.parse(req.body);
    const result = await createUser(validatedData);
    const session = await createSession(result.userid)

    const maxAge = session.expiresAt.getTime() - Date.now();

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
    });

    res.status(201).json({
      status: 'success',
      message: result.message,
      userID: result.userid,
      timestamp: new Date(),
    });

  } catch (err: any) {

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

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
      status: 'error',
      message,
      timestamp: new Date(),
    });
  }
};
