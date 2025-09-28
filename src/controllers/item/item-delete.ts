import type { Request, Response } from "express";
import { deleteItem } from "../../service/item/delete-item.js";
import { DeleteItemDto } from "../../schemas/item-schema.js";

export const deleteItemCon = async (req: Request, res: Response) => {
  const validData = DeleteItemDto.parse(req.body);

  const result = await deleteItem(validData.itemId);

  res.status(201).json({
    status: "success",
    message: `Item ${result.itemName} has been deleted`,
    tableName: result.itemName,
    timestamp: new Date(),
  });
};
