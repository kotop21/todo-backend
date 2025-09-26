import { db } from "../index-database.js";

export const deleteItem = async (itemId: number) => {

  const item = await db.tableItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    const error: any = new Error(`Item with id ${itemId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await db.tableItem.delete({
    where: { id: itemId },
  });
};
