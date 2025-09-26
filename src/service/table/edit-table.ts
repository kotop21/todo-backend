import { db } from "../index-database.js";

export const editTable = async (tableId: number, nameTable: string) => {
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
    throw err;
  }
};
