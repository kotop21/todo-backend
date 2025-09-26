import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { getItem } from '../../service/item/get-items.js';

export const getItemsCon = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userID;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
        timestamp: new Date(),
      });
    }
    const result = await getItem(userId)

    res.status(201).json({
      status: 'success',
      message: 'Item retrieved successfully',
      count: result.length,
      timestamp: new Date(),
      result
    });

  } catch (err: any) {
    if (err instanceof ZodError) {
      const errors = err.issues.reduce((acc, curr) => {
        if (curr.path && curr.path[0]) {
          acc[curr.path[0] as string] = curr.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
        timestamp: new Date(),
      });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      status: 'error',
      message,
      timestamp: new Date(),
    });
  }
};
