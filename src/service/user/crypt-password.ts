import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (passwordIn: string) => {
  if (!passwordIn) {
    const error: any = new Error("Password is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(passwordIn, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  } catch (err) {
    console.error("Error hashing password:", err)
    const error: any = new Error("Failed to hash password");
    error.statusCode = 500;
    throw error;
  }
}

export const verifyPassword = async (passwordIn: string, hashed: string) => {
  if (!hashed || !passwordIn) {
    const error: any = new Error("Password and hashed Password is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const [salt, key] = hashed.split(':');
    if (!salt || !key) throw new Error('Invalid hashed password format');

    const derivedKey = (await scrypt(passwordIn, salt, 64)) as Buffer;
    return derivedKey.toString('hex') === key;
  } catch (err) {
    console.error("Error verifying password:", err)
    const error: any = new Error("Failded to verify password");
    error.statusCode = 401;
    throw error;
  }
}



