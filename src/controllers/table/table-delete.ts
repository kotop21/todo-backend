import type { Request, Response } from 'express';
import { deleteTableById } from '../../service/table/delete-table.js';
import { DeleteTableDto } from '../../schemas/table-schema.js';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const validatedData = DeleteTableDto.parse(req.body);
    let payload: any;
    try {
      payload = jwt.verify(req.cookies?.accessToken || '', process.env.ACCESS_TOKEN_SECRET!);
    } catch {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or missing access token',
        timestamp: new Date(),
      });
    }

    const result = await deleteTableById(validatedData.tableId)

    res.status(201).json({
      status: 'success',
      message: `Table ${result.name} has been deleted`,
      tableName: result.name,
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
