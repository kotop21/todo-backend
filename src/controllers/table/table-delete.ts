import type { Request, Response } from 'express';
import { deleteTable } from '../../service/table/delete-table.js';
import { DeleteTableDto } from '../../schemas/table-schema.js';
import { ZodError } from 'zod';

export const deleteTableCon = async (req: Request, res: Response) => {
  const validData = DeleteTableDto.parse(req.body);

  const result = await deleteTable(validData.tableId)

  res.status(201).json({
    status: 'success',
    message: `Table ${result.name} has been deleted`,
    tableName: result.name,
    timestamp: new Date(),
  });
};
