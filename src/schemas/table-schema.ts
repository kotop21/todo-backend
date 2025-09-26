import { z } from "zod";

export const CreateTableDto = z.object({
  tableName: z
    .string({ message: "Invalid table name" })
    .min(1, { message: "Table name is required" })
    .max(10, { message: "Table name must be at most 10 characters" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9_]+$/, {
      message:
        "Table name can only contain letters (Latin, Cyrillic), numbers, and underscores",
    }),
});

export const EditTableDto = z.object({
  tableId: z
    .number({ message: "Invalid table id" })
    .min(1, { message: "Table id is required" }),
  tableName: z
    .string({ message: "Invalid table name" })
    .min(1, { message: "Table name is required" })
    .max(10, { message: "Table name must be at most 10 characters" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9_]+$/, {
      message:
        "Table name can only contain letters (Latin, Cyrillic), numbers, and underscores",
    }),
});

export const DeleteTableDto = z.object({
  tableId: z
    .number({ message: "Invalid table id" })
    .min(1, { message: "Table id is required" })
});

export const GetTableDto = z.object({
  tableId: z
    .number({ message: "Invalid table id" })
    .min(1, { message: "Table id is required" })
});


export type CreateTableDto = z.infer<typeof CreateTableDto>;
export type DeleteTableDto = z.infer<typeof DeleteTableDto>;
export type GetTableDto = z.infer<typeof GetTableDto>;
export type EditTableDto = z.infer<typeof EditTableDto>;