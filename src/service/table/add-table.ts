import { db } from "../index-database.js";

export const addTable = async (nameTable: string, userId: number) => {
  if (!nameTable || !userId) {
    const error: any = new Error("Table name and User id is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const newTable = await db.table.create({
      data: {
        name: nameTable,
        userId: userId,
      },
    });

    return {
      name: newTable.name,
      tableId: newTable.id,
    };

  } catch (err: any) {
    console.error("Error add Table:", err);
    const error: any = new Error("Failed to add Table");
    error.statusCode = 400;
    throw error;
  }
};
