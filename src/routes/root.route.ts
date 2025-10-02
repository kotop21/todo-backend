import express from "express";
import { root } from "../controllers/root.js";

const rootRouter: express.Router = express.Router();
rootRouter.post("/", root);

export default rootRouter;