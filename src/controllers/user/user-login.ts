import type { Request, Response } from 'express';
import { searchUserByEmail } from '../../service/user/database/user-search.js';
import { createRefreshToken } from '../../service/user/database/user-refresh-token.js';
import { generateAccessToken } from '../../service/gen-access-token.js';
import { LoginUserDto } from "../../schemas/user-schema.js";
import { verifyPassword } from '../../service/user/crypt-password.js';
import { ZodError } from 'zod';

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = LoginUserDto.parse(req.body);

    const userData = await searchUserByEmail(validatedData.email);
    const verifPassword = await verifyPassword(validatedData.password, userData.password)
    if (!verifPassword) {
      const error: any = new Error("Password dont correct");
      error.statusCode = 401;
      throw error;
    }
    const refreshToken = await createRefreshToken(userData.userid);

    const maxAgeRefresh = refreshToken.refreshTokenExpiresAt.getTime() - Date.now();

    res.cookie("refreshToken", refreshToken.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeRefresh,
    });

    const accessToken = generateAccessToken({
      userID: userData.userid,
      email: userData.email,
      createdAt: userData.regDate.toISOString(),
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
      message: "Autorization is success",
      userID: userData.userid,
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
