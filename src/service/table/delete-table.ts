import { db } from "../index-database.js";

export const deleteTable = async (tableId: number) => {
  if (!tableId) {
    const error: any = new Error("Table id is required");
    error.statusCode = 400;
    throw error;
  }

  const table = await db.table.findUnique({
    where: { id: tableId },
  });

  if (!table) {
    const error: any = new Error(`Table with id ${tableId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await db.table.delete({
    where: { id: tableId },
  });
};
