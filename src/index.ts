import express from "express";
import { app } from "./app.js";
import { db } from "./service/index-database.js";
const port: number = 3000;


async function main() {
  app.listen(port, () => {
    console.log(`Слушаем порт: ${port}`);
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
