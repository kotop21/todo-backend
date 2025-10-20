import type { Request, Response } from 'express';
import { LogoutUserDto } from "../../schemas/user-schema.js";

export const userLogoutCon = async (req: Request, res: Response) => {
  const validData = LogoutUserDto.parse(req.body);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: "Logout successful, tokens removed",
    timestamp: new Date(),
  });

};
