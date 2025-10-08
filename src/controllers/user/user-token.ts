import type { Request, Response } from 'express';
import { searchRefreshToken, searchUserById } from '../../service/user/database/user-search.js';
import { updateRefreshToken } from '../../service/user/database/user-refresh-token.js';
import { generateAccessToken } from '../../service/gen-access-token.js';

export const userGetTokenCon = async (req: Request, res: Response) => {
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
  const refreshToken = await updateRefreshToken(search.id);
  const result = await searchUserById(search.id);

  const maxAgeRefresh = refreshToken.refreshTokenExpiresAt.getTime() - Date.now();

  const isDev = process.argv.includes('-dev');

  res.cookie("refreshToken", refreshToken.refreshToken, {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "none" : "strict",
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
    secure: !isDev,
    sameSite: isDev ? "none" : "strict",
    maxAge: accessTokenMaxAge,
  });

  res.status(201).json({
    status: 'success',
    message: "Successful token creation",
    userID: search.id,
    timestamp: new Date(),
  });
};
