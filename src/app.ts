import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlawes/error-handler.js";

import router from "./routes/index.js"

export const app: express.Application = express();
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

app.use(router.rootRouter);
app.use("/user", router.userRouter);
app.use("/table", router.tableRouter);
app.use("/item", router.itemRouter);

app.use(errorHandler);