import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/service/users/database/index-database.js";

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

  it("Тест успішної реєстрації", async () => {
    const userData = {
      email: "aboba@gmail.com",
      password: "testPassword123!"
    };

    const response = await request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'success',
    });
  });

  it("Тест зареєстрованного користувача", async () => {
    const userData = {
      email: "aboba@gmail.com",
      password: "testPassword123!"
    };

    const response = await request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json");

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      status: 'error',
    });
  });
  it("Тест помилкової реєстрації", async () => {
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
