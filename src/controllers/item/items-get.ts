import type { Request, Response } from 'express';
import { getItem } from '../../service/item/get-items.js';
import { GetItemDto } from "../../schemas/item-schema.js";

export const getItemsCon = async (req: Request, res: Response) => {
  const userId = GetItemDto.parse({ userId: Number(req.params.id) });

  const result = await getItem(userId.userId)

  res.status(201).json({
    status: 'success',
    message: 'Item retrieved successfully',
    count: result.length,
    timestamp: new Date(),
    result
  });
};
