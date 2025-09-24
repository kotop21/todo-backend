import { db } from "./index-database.js";
import { hashPassword } from "../crypt-password.js";
import { RegisterUserDto } from "../../../schemas/user-schema.js";
import { searchEmail } from "./user-search.js";
import { createRefreshToken } from "./user-refresh-token.js";

export const createUser = async (data: RegisterUserDto) => {
  try {
    const refreshToken = await createRefreshToken()
    const existingEmail = await searchEmail(data.email);
    if (existingEmail) {
      const error: any = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await db.user.create({
      data: {
        email: data.email,
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
    throw err;
  }
};
