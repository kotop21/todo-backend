import type { Request, Response } from 'express';
import { getTableByUserId } from '../../service/table/get-tables.js';
import { GetTableDto } from '../../schemas/table-schema.js';

export const getTablesCon = async (req: Request, res: Response) => {
  const userId = GetTableDto.parse({ userId: Number(req.params.id) });

  const result = await getTableByUserId(userId.userId)

  res.status(201).json({
    status: 'success',
    message: 'Tables retrieved successfully',
    createAt: result.createdAt,
    count: result.length,
    timestamp: new Date(),
    result
  });
};
