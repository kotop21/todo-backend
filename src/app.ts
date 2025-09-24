import express from "express";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import cookieParser from 'cookie-parser';

import router from "./routes/index.js"

export const app: Express = express();
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    validatorUrl: null,
    supportedSubmitMethods: []
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use(cookieParser())
app.use(express.json());
app.use(router.index);
app.use(router.user);