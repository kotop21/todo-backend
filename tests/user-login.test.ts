import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/service/user/database/index-database.js";

describe("POST /login", () => {
  const testUser = {
    email: "test@gmail.com",
    password: "testPassword123!"
  };

  beforeAll(async () => {
    await request(app)
      .post("/register")
      .send(testUser)
      .set("Accept", "application/json");
  });

  afterAll(async () => {
    await db.user.deleteMany({
      where: {
        email: testUser.email
      }
    });
    await db.$disconnect();
  });

  it("Успешная авторизация с правильными данными", async () => {
    const response = await request(app)
      .post("/login")
      .send(testUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("userID");
    expect(response.body).toHaveProperty("timestamp");

    const cookies = response.headers["set-cookie"];
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining("refreshToken="),
        expect.stringContaining("accessToken="),
      ])
    );
  });

  it("Авторизация с неправильным паролем", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: testUser.email,
        password: "wrongPassword"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Password dont correct");
    expect(response.body).toHaveProperty("timestamp");
  });

  it("Авторизация без обязательных полей (валидация)", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "", password: "" })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toHaveProperty("email");
    expect(response.body.errors).toHaveProperty("password");
    expect(response.body).toHaveProperty("timestamp");
  });

  it("Авторизация несуществующего пользователя", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "nouser@example.com",
        password: "somePassword123!"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBeDefined();
    expect(response.body).toHaveProperty("timestamp");
  });
});
