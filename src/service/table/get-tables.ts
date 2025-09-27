import { db } from "../index-database.js";

export const getTableByUserId = async (userId: number) => {
  if (!userId) {
    const error: any = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    return await db.table.findMany({
      where: { userId: userId },
    });
  } catch (err) {
    console.error("Error edit Table:", err);
    const error: any = new Error("Failed to edit Table");
    error.statusCode = 400;
    throw error;
  }
}
