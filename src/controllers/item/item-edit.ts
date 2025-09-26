import type { Request, Response } from 'express';
import { editItem } from '../../service/item/edit-item.js';
import { EditItemDto } from '../../schemas/item-schema.js';
import { ZodError } from 'zod';

export const editItemCon = async (req: Request, res: Response) => {
  try {
    const validData = EditItemDto.parse(req.body);

    const result = await editItem(validData.itemId, validData.itemName);

    res.status(201).json({
      status: 'success',
      message: 'Item updated',
      tableName: result.itemName,
      timestamp: new Date(),
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
