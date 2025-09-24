/* 
  !Сделать тесты для авторизации
  
  TODO 1. Создать пользователя в бд
  TODO 2. Тест с правильными данными 
  TODO 3. Не правильные данные 
  TODO 4. Удалить пользователя из бд
  * Готово :)
*/

import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/service/user/database/index-database.js";

// if (response.status !== 201) {
//   console.log(response.body);
// }

describe("POST /register", () => {
  afterAll(async () => {
    await db.user.deleteMany({
      where: {
        email: "aboba@gmail.com"
      }
    });
    await db.$disconnect();
  });

  it("Тест успішної авторизації", async () => {
    const userData = {
      email: "aboba@gmail.com",
      password: "testPassword123!"
    };

    const response = await request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json");
    if (response.status !== 201) {
      console.log(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'success',
    });
  });

  it("Тест помилкової авторизації", async () => {
    const invalidData = {
      email: "",
      password: "123"
    };

    const response = await request(app)
      .post("/register")
      .send(invalidData)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toHaveProperty("email");
    expect(response.body.errors).toHaveProperty("password");
    expect(response.body).toHaveProperty("timestamp");
  });
});
