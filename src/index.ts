import express from "express";
import { app } from "./app.js";
import { db } from "./service/users/database/index-database.js"

const port: number = 3000;
async function main() {


  app.listen(port, () => {
    console.log(`Слухаєм порт: ${port}`);
  });
}


main()
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })