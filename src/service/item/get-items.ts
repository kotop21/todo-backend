import { db } from "../index-database.js";

export const getItem = async (userId: number) => {
  if (!userId) {
    const error: any = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }

  return await db.tableItem.findMany({
    where: { userId: userId },
  });
};
