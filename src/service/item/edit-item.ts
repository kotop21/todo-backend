import { db } from "../index-database.js";

export const editItem = async (itemId: number, itemName: string) => {
  if (!itemId || !itemName) {
    const error: any = new Error("Item ID and item name are required.");
    error.statusCode = 400;
    throw error;
  }
  try {
    const item = await db.tableItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      const error: any = new Error("Item not found");
      error.statusCode = 404;
      throw error;
    }

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
    console.error("Error updating item:", err);

    if (err.statusCode) {
      throw err;
    }

    const error: any = new Error("Failed to update item.");
    error.statusCode = 400;
    throw error;
  }
} 
