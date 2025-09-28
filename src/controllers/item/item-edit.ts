import type { Request, Response } from 'express';
import { editItem } from '../../service/item/edit-item.js';
import { EditItemDto } from '../../schemas/item-schema.js';
import { ZodError } from 'zod';

export const editItemCon = async (req: Request, res: Response) => {
  const validData = EditItemDto.parse(req.body);

  const result = await editItem(validData.itemId, validData.itemName);

  res.status(201).json({
    status: 'success',
    message: 'Item updated',
    tableName: result.itemName,
    timestamp: new Date(),
  });
};
