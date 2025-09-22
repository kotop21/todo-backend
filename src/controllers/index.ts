import type { Request, Response } from 'express';

export const index = async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Service is running',
  });
};
