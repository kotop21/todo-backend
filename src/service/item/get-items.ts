import { db } from "../index-database.js";

export const getItem = async (userId: number) => {
  if (!userId) {
    const error: any = new Error("User ID обязателен");
    error.statusCode = 400;
    throw error;
  }
  try {
    return await db.tableItem.findMany({
      where: { userId: userId },
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    const error: any = new Error("Failed to fetch items");
    error.statusCode = 400;
    throw error;
  }
};
