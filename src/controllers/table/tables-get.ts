import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { getTableByUserId } from '../../service/table/get-tables.js';

export const getTablesCon = async (req: Request, res: Response) => {
  const userId = req.user?.userID;
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated',
      timestamp: new Date(),
    });
  }
  const result = await getTableByUserId(userId)

  res.status(201).json({
    status: 'success',
    message: 'Tables retrieved successfully',
    count: result.length,
    timestamp: new Date(),
    result
  });
};
