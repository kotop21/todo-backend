import type { Request, Response } from 'express';
import { createUser } from "../../service/user/database/user-register.js";
import { RegisterUserDto } from "../../schemas/user-schema.js";
import { generateAccessToken } from '../../service/gen-access-token.js';

export const userRegisterCon = async (req: Request, res: Response) => {
  const validData = RegisterUserDto.parse(req.body);
  const result = await createUser(validData.email, validData.password);

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
};
