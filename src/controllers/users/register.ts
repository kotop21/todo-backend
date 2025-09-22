import type { Request, Response } from 'express';
import { createUser } from "../../servise/users/database/user-register.js"

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and password are required',
    });
  }
  const newUser = await createUser({ name, password });
  res.status(200).json({
    status: 'success',
    message: 'Пользователь успешно создан.',
    user: name,
  });
  console.log(`Пользователь ${name} успешно создан.`);
};
