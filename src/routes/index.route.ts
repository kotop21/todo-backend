import { Router } from "express";
import { index } from "../controllers/index.js";

const userRouter: Router = Router();
userRouter.post("/", index);

export default userRouter;