import { hashPassword, verifyPassword } from '../service/users/crypt-password.js';

describe('Хешування та перевірка паролів', () => {
  const password = 'SuperSecret123!';
  let hashedPassword: string;

  it('повинна хешувати пароль', async () => {
    hashedPassword = await hashPassword(password);
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).toContain(':'); // salt:hash
  });

  it('повинна підтверджувати правильний пароль', async () => {
    const isValid = await verifyPassword(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('не повинна підтверджувати неправильний пароль', async () => {
    const isValid = await verifyPassword('WrongPassword', hashedPassword);
    expect(isValid).toBe(false);
  });

  it('повинна викидати помилку при некоректному форматі хеша', async () => {
    await expect(verifyPassword(password, 'invalidhash')).rejects.toThrow(
      'Invalid hashed password format'
    );
  });
});
