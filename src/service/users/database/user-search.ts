import { db } from "./index-database.js";

export const searchEmail = async (email: string) => {
  return db.user.findFirst({
    where: {
      email: email,
    },
  });
};
