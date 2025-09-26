import { db } from "../index-database.js";

export const addTable = async (nameTable: string, userId: number) => {
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
    throw err;
  }
};
