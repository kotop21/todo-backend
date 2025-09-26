import type { Request, Response } from 'express';
import { addTable } from '../../service/table/add-table.js';
import { CreateTableDto } from '../../schemas/table-schema.js';
import { ZodError } from 'zod';

export const createTableCon = async (req: Request, res: Response) => {
  try {
    const validData = CreateTableDto.parse(req.body);
    const userId = req.user?.userID;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
        timestamp: new Date(),
      });
    }
    const result = await addTable(validData.tableName, userId);


    res.status(201).json({
      status: 'success',
      message: 'Table created',
      tableName: result.name,
      tableId: result.tableId,
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
