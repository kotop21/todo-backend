import express from "express";
import type { Express } from "express";

import router from "./routes/index.js"

export const app: Express = express();

app.use(express.json());
app.use(router.index);
app.use(router.user);