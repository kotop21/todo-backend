import { db } from "../index-database.js";

export const editTable = async (tableId: number, nameTable: string) => {
  if (!tableId || !nameTable) {
    const error: any = new Error("Table id and Table name is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const table = await db.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      const error: any = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedTable = await db.table.update({
      where: {
        id: tableId,
      },
      data: {
        name: nameTable,
      },
    });

    return {
      tableId: updatedTable.id,
      name: updatedTable.name,
    };
  } catch (err: any) {
    console.error("Error edit Table:", err);

    if (err.statusCode) {
      throw err;
    }

    const error: any = new Error("Failed to edit Table");
    error.statusCode = 400;
    throw error;
  }
};
