import { Router } from "express";
import { root } from "../controllers/root.js";

const indexRouter: Router = Router();
indexRouter.post("/", root);

export default indexRouter;