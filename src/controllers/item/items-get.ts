import type { Request, Response } from 'express';
import { getItem } from '../../service/item/get-items.js';

export const getItemsCon = async (req: Request, res: Response) => {
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
};
