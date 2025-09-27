import type { Request, Response } from 'express';
import { createUser } from "../../service/user/database/user-register.js";
import { RegisterUserDto } from "../../schemas/user-schema.js";
import { ZodError } from "zod";
import { generateAccessToken } from '../../service/gen-access-token.js';

export const userRegisterCon = async (req: Request, res: Response) => {
  try {
    const validData = RegisterUserDto.parse(req.body);
    const result = await createUser(validData.email);

    const maxAgeRefresh = result.refreshTokenExpiresAt.getTime() - Date.now();

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeRefresh,
    });

    const accessToken = generateAccessToken({
      userID: result.userid,
      email: validData.email,
      createdAt: result.regDate.toISOString(),
    });

    const accessTokenMaxAge = 15 * 60 * 1000;

    res.cookie("accessToken", accessToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessTokenMaxAge,
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
        errors,
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
