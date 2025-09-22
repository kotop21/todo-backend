import type { Request, Response } from 'express';

export const home = async (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Service is running',
  });
};
