import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password: string, hashed: string) => {
  const [salt, key] = hashed.split(':');
  if (!salt || !key) throw new Error('Invalid hashed password format');

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === key;
};



