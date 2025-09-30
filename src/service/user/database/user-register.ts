import { db } from "../../index-database.js";
import { hashPassword } from "../crypt-password.js";
import { regSearchUserByEmail } from "./user-search.js";
import { createRefreshToken } from "./user-refresh-token.js";

export const createUser = async (userEmail: string, userPassword: string) => {
  if (!userEmail) {
    const error: any = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }
  try {
    const refreshToken = await createRefreshToken()
    const existingEmail = await regSearchUserByEmail(userEmail);
    if (existingEmail) {
      const error: any = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(userPassword);

    const newUser = await db.user.create({
      data: {
        email: userEmail,
        password: hashedPassword,
        regDate: new Date(),
        refreshToken: refreshToken.hashedToken,
        refreshTokenExpiresAt: refreshToken.refreshTokenExpiresAt,
      },
    });
    return {
      message: "User register",
      userid: newUser.id,
      regDate: newUser.regDate,
      refreshToken: refreshToken.refreshToken,
      refreshTokenExpiresAt: newUser.refreshTokenExpiresAt,
    };

  } catch (err: any) {
    console.error("Error create User:", err);
    throw err;
  }
};
