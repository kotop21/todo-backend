import { db } from "./index-database.js";
import { hashPassword } from "../crypt-password.js";
import { UserData } from "../../../schemas/user-schema.js";
import { searchUser } from "./user-search.js";

export const createUser = async (data: UserData) => {
  try {
    const existingUser = await searchUser(data.name);
    if (existingUser) throw new Error("Пользователь с таким именем уже существует.");

    const hashedPassword = await hashPassword(data.password);

    const newUser = await db.user.create({
      data: {
        name: data.name,
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
