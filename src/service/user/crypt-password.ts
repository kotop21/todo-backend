import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (passwordUser: string) => {
  if (!passwordUser) throw Object.assign(new Error("Password is required"), { statusCode: 400 });

  try {
    const salt = randomBytes(16); // Buffer
    const derivedKey = (await scrypt(passwordUser, salt, 64)) as Buffer;
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw Object.assign(new Error("Failed to hash password"), { statusCode: 500 });
  }
}

export const verifyPassword = async (passwordUser: string, hashed: string) => {
  if (!passwordUser || !hashed) {
    throw Object.assign(new Error("Password and hashed password are required"), { statusCode: 400 });
  }
  try {
    const [saltHex, key] = hashed.split(':');
    if (!saltHex || !key) throw new Error('Invalid hashed password format');

    const derivedKey = (await scrypt(passwordUser, Buffer.from(saltHex, 'hex'), 64)) as Buffer;

    if (derivedKey.toString('hex') !== key) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    return true;
  } catch (err: any) {
    console.error("Error verifying password:", err);
    if (err.statusCode) {
      throw err;
    }
    const error: any = new Error("Failed to verify password");
    error.statusCode = 401;
    throw error;
  }
}


