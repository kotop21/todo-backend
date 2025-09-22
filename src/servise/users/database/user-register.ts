import { db } from "./index-database.js";
import { hashPassword } from "../crypt-password.js";

interface UserData {
  name: string;
  password: string;
}

export const createUser = async (data: UserData) => {
  const hashedPassword = await hashPassword(data.password);
  return db.user.create({
    data: {
      name: data.name,
      password: hashedPassword,
      regDate: new Date(),
    },
  });
};

