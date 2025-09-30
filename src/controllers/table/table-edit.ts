import type { Request, Response } from 'express';
import { editTable } from '../../service/table/edit-table.js';
import { EditTableDto } from '../../schemas/table-schema.js';
import { ZodError } from 'zod';

export const editTableCon = async (req: Request, res: Response) => {
  const validData = EditTableDto.parse(req.body);

  const result = await editTable(validData.tableId, validData.tableName);

  res.status(201).json({
    status: 'success',
    message: 'Table updated',
    tableName: result.name,
    timestamp: new Date(),
  });
};
