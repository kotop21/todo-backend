import { db } from "../index-database.js";

export const deleteTable = async (tableId: number) => {
  if (!tableId) {
    const error: any = new Error("Table id is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const table = await db.table.findUnique({
      where: { id: tableId },
    });

    return await db.table.delete({
      where: { id: tableId },
    });
  } catch (err) {
    console.error("Error delete Table:", err);
    const error: any = new Error("Failed to delete Table");
    error.statusCode = 400;
    throw error;
  }
}