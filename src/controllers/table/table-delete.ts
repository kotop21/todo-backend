import type { Request, Response } from 'express';
import { deleteTable } from '../../service/table/delete-table.js';
import { DeleteTableDto } from '../../schemas/table-schema.js';

export const deleteTableCon = async (req: Request, res: Response) => {
  const validData = DeleteTableDto.parse({ tableId: Number(req.params.id) });

  const result = await deleteTable(validData.tableId)

  res.status(201).json({
    status: 'success',
    message: `Table ${result.name} has been deleted`,
    tableName: result.name,
    timestamp: new Date(),
  });
};
