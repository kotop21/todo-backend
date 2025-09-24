import { Router } from "express";
import user from "../controllers/user/index.js";

const userRouter: Router = Router();

userRouter.post("/register", user.register);
userRouter.post("/login", user.login);
userRouter.post("/get-token", user.getToken);

export default userRouter;