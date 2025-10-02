import { Router } from "express";
import { root } from "../controllers/root.js";

const rootRouter: Router = Router();
rootRouter.post("/", root);

export default rootRouter;