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

  if (devToken && token === devToken) {
    req.user = {
      userID: 1,
      email: 'dev@example.com',
      createdAt: new Date().toISOString(),
    };
    return next();
  }

  if (!secret) {
    return res.status(500).json({
      status: 'error',
      message: 'Server misconfiguration: ACCESS_TOKEN_SECRET is missing',
      timestamp: new Date(),
    });
  }

  try {
    const payload = jwt.verify(token, secret) as AccessTokenData;
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired access token',
      timestamp: new Date(),
    });
  }
};
