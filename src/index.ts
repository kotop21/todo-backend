import express from "express";
import { app } from "./app.js";

const port: number = 3000;

async function main() {


  app.listen(port, () => {
    console.log(`Слухаєм порт: ${port}`);
  });
}


main()