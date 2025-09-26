import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as express from 'express';

interface AccessTokenData {
  userID: number;
  email: string;
  createdAt: string;
}

// Расширяем Request, чтобы TS знал о user
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

  if (!token || !secret) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing access token',
      timestamp: new Date(),
    });
  }

  try {
    const payload = jwt.verify(token, secret) as AccessTokenData;
    req.user = payload; // кладём данные в req.user
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired access token',
      timestamp: new Date(),
    });
  }
};