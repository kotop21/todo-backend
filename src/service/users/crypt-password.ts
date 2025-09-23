import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password: string, hashed: string) => {
  const parts = hashed.split(':');

  if (parts.length !== 2) throw new Error('Invalid hashed password format');

  const salt = parts[0];
  const key = parts[1];

  if (!salt || !key) throw new Error('Invalid hashed password format');

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === key;
};


