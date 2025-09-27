import { db } from "../index-database.js";

export const editTable = async (tableId: number, nameTable: string) => {
  if (!tableId || !nameTable) {
    const error: any = new Error("Table id and Table name is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const updatedTable = await db.table.update({
      where: {
        id: tableId,
      },
      data: {
        name: nameTable,
      },
    });

    return {
      name: updatedTable.name,
    };
  } catch (err: any) {
    console.error("Error edit Table:", err);
    const error: any = new Error("Failed to edit Table");
    error.statusCode = 400;
    throw error;
  }
};
