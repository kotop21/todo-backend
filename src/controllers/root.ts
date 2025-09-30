import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const root = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken; // читаем из куки, если есть

  if (!token || typeof token !== 'string') {
    return res.json({
      status: 'success',
      message: 'Service is running',
      tokenStatus: 'No token provided',
    });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');

    const decoded = jwt.verify(token, secret);

    return res.json({
      status: 'success',
      message: 'Service is running',
      tokenStatus: 'Token accepted',
      decodedToken: decoded,
    });
  } catch (err: any) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      tokenStatus: 'Token rejected',
      error: err.message,
    });
  }
};
