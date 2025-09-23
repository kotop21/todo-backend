import { db } from "./index-database.js";

export const searchUser = async (name: string) => {
  return db.user.findFirst({
    where: {
      name: name,
    },
  });
};
