import { Router } from "express";
import user from "../controllers/user/index.js";
import { asyncHandler } from "../middlawes/async-handler.js";

const userRouter: Router = Router();

userRouter.post("/register", asyncHandler(user.userRegisterCon));
userRouter.post("/login", asyncHandler(user.userLoginCon));
userRouter.post("/get-token", asyncHandler(user.userGetTokenCon));
userRouter.post("/logout", asyncHandler(user.userLogoutCon));

export default userRouter;
