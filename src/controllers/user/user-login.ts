import type { Request, Response } from 'express';
import { searchUserByEmail } from '../../service/user/database/user-search.js';
import { createRefreshToken } from '../../service/user/database/user-refresh-token.js';
import { generateAccessToken } from '../../service/gen-access-token.js';
import { LoginUserDto } from "../../schemas/user-schema.js";
import { verifyPassword } from '../../service/user/crypt-password.js';

export const userLoginCon = async (req: Request, res: Response) => {
  const validData = LoginUserDto.parse(req.body);
  const userData = await searchUserByEmail(validData.email);
  const verifPassword = await verifyPassword(validData.password, userData.password);

  const refreshToken = await createRefreshToken();
  const maxAgeRefresh = refreshToken.refreshTokenExpiresAt.getTime() - Date.now();
  const isDev = process.argv.includes('-dev');

  res.cookie("refreshToken", refreshToken.refreshToken, {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "none" : "strict",
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
    secure: !isDev,
    sameSite: isDev ? "none" : "strict",
    maxAge: accessTokenMaxAge,
  });

  res.status(201).json({
    status: 'success',
    message: "Authorization is success",
    userID: userData.userid,
    userRegDate: userData.regDate,
    timestamp: new Date(),
  });
};
