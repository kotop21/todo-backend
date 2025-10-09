import { db } from "../index-database.js";

export const addItem = async (
  nameItem: string,
  itemDescrip: string | null,
  tableId: number,
  userId: number
) => {
  if (!userId || !nameItem || !tableId) {
    const error: any = new Error("User id, Item name и Table id обязательны");
    error.statusCode = 400;
    throw error;
  }

  try {
    const table = await db.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      const error: any = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }

    const newItem = await db.tableItem.create({
      data: {
        itemName: nameItem,
        itemDescrip: itemDescrip || null, // теперь можно не указывать
        table: {
          connect: { id: tableId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    return {
      itemDescrip: newItem.itemDescrip,
      itemName: newItem.itemName,
      userId: newItem.userId,
      itemId: newItem.id,
    };
  } catch (err: any) {
    console.error("Ошибка при создании item:", err);
    if (err.statusCode) {
      throw err;
    }
    const error: any = new Error("Не удалось создать item");
    error.statusCode = 400;
    throw error;
  }
};
