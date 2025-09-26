import { Router } from "express";
import user from "../controllers/user/index.js";

const userRouter: Router = Router();

userRouter.post("/register", user.userRegisterCon);
userRouter.post("/login", user.userLoginCon);
userRouter.post("/get-token", user.userGetTokenCon);

export default userRouter;