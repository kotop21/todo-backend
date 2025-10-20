import request from 'supertest';
import { app } from '../src/app.js';
import { db } from "../src/service/index-database.js";

describe('Full user/item/table flow', () => {
  let authCookies: string[] = [];
  let userId: number;
  let tableId: number;
  let itemId: number;
  const testEmail = `testuser_${Date.now()}@mail.com`;
  const testPassword = 'Test123!';

  afterAll(async () => {
    await db.user.deleteMany({
      where: {
        id: userId
      }
    });
    await db.$disconnect();
  });

  it('should register user', async () => {
    const regRes = await request(app)
      .post('/user/register')
      .send({ email: testEmail, password: testPassword });
    expect(regRes.statusCode).toBe(201);
    expect(regRes.body.status).toBe('success');
    userId = regRes.body.userID;
  });

  it('should login user and get cookies', async () => {
    const loginRes = await request(app)
      .post('/user/login')
      .send({ email: testEmail, password: testPassword });
    expect(loginRes.statusCode).toBe(201);
    expect(loginRes.body.status).toBe('success');

    // Сохраняем авторизационные cookies для всех следующих запросов
    const setCookie = loginRes.headers['set-cookie'];
    authCookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    userId = loginRes.body.userID;
  });

  it('should create table', async () => {
    const res = await request(app)
      .post('/table')
      .set('Cookie', authCookies)
      .send({ tableName: 'TestTable' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    tableId = res.body.tableId;
  });

  it('should create item', async () => {
    const res = await request(app)
      .post('/item')
      .set('Cookie', authCookies)
      .send({ itemName: 'TestItem', tableId });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    itemId = res.body.itemId;
  });

  it('should delete item', async () => {
    const res = await request(app)
      .delete(`/item/${itemId}`)
      .set('Cookie', authCookies);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('should delete table', async () => {
    const res = await request(app)
      .delete(`/table/${tableId}`)
      .set('Cookie', authCookies);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('should logout user at the end', async () => {
    const logoutRes = await request(app)
      .post('/user/logout')
      .send({ refreshToken: 'dummyRefreshToken', accessToken: '' });
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.status).toBe('success');
  });
});

describe('Error cases for user/item/table', () => {
  let cookies: string[] = [];
  let tableId: number;
  let itemId: number;
  const testEmail = `erroruser_${Date.now()}@mail.com`;
  const testPassword = 'Test123!';

  beforeAll(async () => {
    const regRes = await request(app)
      .post('/user/register')
      .send({ email: testEmail, password: testPassword });

    cookies = Array.isArray(regRes.headers['set-cookie']) ? regRes.headers['set-cookie'] : [regRes.headers['set-cookie']];

    const tableRes = await request(app)
      .post('/table')
      .set('Cookie', cookies)
      .send({ tableName: 'ErrTable' });

    tableId = tableRes.body.tableId;

    const itemRes = await request(app)
      .post('/item')
      .set('Cookie', cookies)
      .send({ itemName: 'ErrItem', tableId });

    itemId = itemRes.body.itemId;
  });

  it('should fail to delete non-existent table', async () => {
    const res = await request(app)
      .delete(`/table/999999`)
      .set('Cookie', cookies);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should fail to delete non-existent item', async () => {
    const res = await request(app)
      .delete(`/item/999999`)
      .set('Cookie', cookies);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should fail to create item with invalid data', async () => {
    const res = await request(app)
      .post('/item')
      .set('Cookie', cookies)
      .send({ itemName: '', tableId });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/validation/i);
  });

  it('should fail to create table with empty name', async () => {
    const res = await request(app)
      .post('/table')
      .set('Cookie', cookies)
      .send({ tableName: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/validation/i);
  });

  it('should fail to register with existing email', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/exists/i);
  });

  it('should fail to login with wrong password', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({ email: testEmail, password: 'WrongPassword123!123' });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should fail to get items without auth', async () => {
    const res = await request(app)
      .get(`/item/999999`);
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('should fail to get tables without auth', async () => {
    const res = await request(app)
      .get(`/table/99999`);
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  afterAll(async () => {
    await db.tableItem.deleteMany({ where: { id: itemId } });
    await db.table.deleteMany({ where: { id: tableId } });
    await db.user.deleteMany({ where: { email: testEmail } });
    await db.$disconnect();
  });
});
