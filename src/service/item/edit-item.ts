import { db } from "../index-database.js";

export const editItem = async (itemId: number, itemName: string) => {
  try {
    const updatedTable = await db.tableItem.update({
      where: {
        id: itemId,
      },
      data: {
        itemName: itemName,
      },
    });

    return {
      itemName: updatedTable.itemName,
    };
  } catch (err: any) {
    throw err;
  }
};
