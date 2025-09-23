import { Router } from "express";
import { home } from "../controllers/home.js";

const indexRouter: Router = Router();
indexRouter.post("/", home);

export default indexRouter;