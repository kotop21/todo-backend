import type { Request, Response } from 'express';
import { addTable } from '../../service/table/add-table.js';
import { CreateTableDto } from '../../schemas/table-schema.js';

export const createTableCon = async (req: Request, res: Response) => {
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
};
