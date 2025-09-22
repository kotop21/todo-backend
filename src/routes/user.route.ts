import { Router } from "express";
import user from "../controllers/users/index.js";

const userRouter: Router = Router();
userRouter.post("/", user.register);

export default userRouter;