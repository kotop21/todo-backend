import express from "express";
import type { Express } from "express";

import index from "./routes/index.route.js"

export const app: Express = express();

app.use(express.json());
app.use("/", index);