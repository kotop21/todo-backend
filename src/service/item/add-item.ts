import { db } from "../index-database.js";

export const addItem = async (nameItem: string, columnId: number, userId: number) => {
  if (!userId) {
    throw new Error("userId обязателен для создания item");
  }

  const newItem = await db.tableItem.create({
    data: {
      itemName: nameItem,
      table: {
        connect: { id: columnId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });

  return {
    itemName: newItem.itemName,
    userId: newItem.userId,
    itemId: newItem.id,
  };
};
