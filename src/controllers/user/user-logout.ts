import type { Request, Response } from 'express';
import { LogoutUserDto } from "../../schemas/user-schema.js";

export const userLogoutCon = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      status: 'fail',
      message: 'Refresh token is required'
    });
  }

  LogoutUserDto.parse({ refreshToken });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: "Logout successful, tokens removed",
    timestamp: new Date(),
  });
};

