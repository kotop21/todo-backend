import request from "supertest";
import { app } from "../app.js";
import { db } from "../service/users/database/index-database.js";

describe("POST /register", () => {
  beforeEach(async () => {
    await db.user.deleteMany({
      where: {
        name: "testUser"
      }
    });
  });

  it("Тест успішної реєстрації", async () => {
    const userData = {
      name: "testUser",
      password: "testPassword123!"
    };

    const response = await request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'User register'
    });
  });

  it("Тест помилкової реєстрації", async () => {
    const invalidData = {
      name: "",
      password: "123"
    };

    const response = await request(app)
      .post("/register")
      .send(invalidData)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toHaveProperty("name");
    expect(response.body.errors).toHaveProperty("password");
    expect(response.body).toHaveProperty("timestamp");
  });

  afterAll(async () => {
    await db.$disconnect();
  });
});
