import type { Request, Response } from 'express';
import { addItem } from '../../service/item/add-item.js';
import { CreateItemDto } from '../../schemas/item-schema.js';
import { ZodError } from 'zod';

export const addItemCon = async (req: Request, res: Response) => {
  const validData = CreateItemDto.parse(req.body);
  const userId = req.user?.userID;
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated',
      timestamp: new Date(),
    });
  }

  const result =
    await addItem(validData.itemName, validData.tableId, userId);

  res.status(201).json({
    status: 'success',
    message: 'Item created',
    tableName: result.itemName,
    itemId: result.itemId,
    timestamp: new Date(),
  });
};
