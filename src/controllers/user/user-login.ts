import type { Request, Response } from 'express';
import { searchRefreshToken, searchUserById } from '../../service/user/database/user-search.js';
import { createRefreshToken } from '../../service/user/database/user-refresh-token.js';
import { generateAccessToken } from '../../middlawes/gen-access-token.js';

export const login = async (req: Request, res: Response) => {
  try {
    const userRefreshToken = req.cookies?.refreshToken;
    if (!userRefreshToken) {
      const error: any = new Error("User doesn't have refreshToken");
      error.statusCode = 401;
      throw error;
    }

    const userAccessToken = req.cookies?.accessToken;
    if (userAccessToken) {
      const error: any = new Error("User has an accessToken");
      error.statusCode = 401;
      throw error;
    }

    const search = await searchRefreshToken(userRefreshToken);
    const refreshToken = await createRefreshToken(search.id);
    const result = await searchUserById(search.id);

    const maxAgeRefresh = refreshToken.refreshTokenExpiresAt.getTime() - Date.now();

    res.cookie("refreshToken", refreshToken.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeRefresh,
    });

    const accessToken = generateAccessToken({
      userID: search.id,
      email: result.email,
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
      userID: search.id,
      timestamp: new Date(),
    });

  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
      status: 'error',
      message,
      timestamp: new Date(),
    });
  }
};
