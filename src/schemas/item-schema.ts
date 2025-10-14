import { z } from "zod";

export const CreateItemDto = z.object({
  tableId: z
    .number({ message: "Invalid table id" })
    .min(1, { message: "Table id is required" }),
  itemName: z
    .string({ message: "Invalid item name" })
    .min(1, { message: "Item name is required" }),
  itemDescrip: z
    .string({ message: "Invalid item descrip" })
    .optional(),
});

export const DeleteItemDto = z.object({
  itemId: z
    .number({ message: "Invalid item id" })
    .min(1, { message: "Item id is required" })
});

export const GetItemDto = z.object({
  userId: z
    .number({ message: "Invalid Item id" })
    .min(1, { message: "Item id is required" })
});

export const EditItemDto = z.object({
  itemId: z
    .number({ message: "Invalid item id" })
    .min(1, { message: "Item id is required" }),
  itemName: z
    .string({ message: "Invalid item name" })
    .min(1, { message: "Item name is required" }),
  itemDescrip: z
    .string({ message: "Invalid item descrip" })
    .optional(),
});

export type CreateItemDto = z.infer<typeof CreateItemDto>;
export type DeleteItemDto = z.infer<typeof DeleteItemDto>;
export type GetItemDto = z.infer<typeof GetItemDto>;
export type EditItemDto = z.infer<typeof EditItemDto>;
