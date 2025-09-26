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
      message: "Table created successfully",
      name: newTable.name,
    };

  } catch (err: any) {
    throw err;
  }
};
