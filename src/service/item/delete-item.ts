import { db } from "../index-database.js";

export const deleteItem = async (itemId: number) => {
  if (!itemId) {
    const error: any = new Error("Item id is required");
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

    return await db.tableItem.delete({
      where: { id: itemId },
    });
  } catch (err: any) {
    console.error("Error delete Item:", err);

    if (err.statusCode) {
      throw err;
    }

    const error: any = new Error("Failed to delete Item");
    error.statusCode = 400;
    throw error;
  };
};
