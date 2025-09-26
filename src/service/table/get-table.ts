import { db } from "../index-database.js";

export const getTableByUserId = async (userId: number) => {
  if (!userId) {
    const error: any = new Error("Table id is required");
    error.statusCode = 400;
    throw error;
  }

  return await db.table.findMany({
    where: { userId },
  });
};
