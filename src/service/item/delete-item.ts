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

    return await db.tableItem.delete({
      where: { id: itemId },
    });
  } catch (err) {
    console.error("Ошибка при удалении item:", err);
    const error: any = new Error("Не удалось удалить iteme");
    error.statusCode = 400;
    throw error;
  };
};
