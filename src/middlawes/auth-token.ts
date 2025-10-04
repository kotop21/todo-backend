import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AccessTokenData {
  userID: number;
  email: string;
  createdAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenData;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const devToken = process.env.DEVELOP_TOKEN;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Missing access token',
      timestamp: new Date(),
    });
  }

  // Если токен совпадает с разработческим, пропускаем проверку
  if (devToken && token === devToken) {
    req.user = {
      userID: 0,
      email: 'developer@example.com',
      createdAt: new Date().toISOString(),
    };
    return next();
  }

  // Проверка JWT выполняется только если разработческий токен не совпадает
  if (!secret) {
    return res.status(500).json({
      status: 'error',
      message: 'Server misconfiguration: ACCESS_TOKEN_SECRET is missing',
      timestamp: new Date(),
    });
  }

  try {
    req.user = jwt.verify(token, secret) as AccessTokenData;
    next();
  } catch {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired access token',
      timestamp: new Date(),
    });
  }
};
