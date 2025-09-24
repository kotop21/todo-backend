import { db } from "./index-database.js";
import { hashPassword } from "../crypt-password.js";
import { RegisterUserDto } from "../../../schemas/user-schema.js";
import { searchEmail } from "./user-search.js";

export const createUser = async (data: RegisterUserDto) => {
  try {
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
      },
    });

    return {
      message: "User register",
      userid: newUser.id,
      regDate: newUser.regDate,
    };

  } catch (err: any) {
    throw err;
  }
};
