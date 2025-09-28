import { Router } from "express";
import item from "../controllers/item/index.js";
import { authenticateToken } from "../middlawes/auth-token.js";
import { asyncHandler } from "../middlawes/async-handler.js";

const itemRouter: Router = Router();

itemRouter.post("/", authenticateToken, asyncHandler(item.addItemCon));
itemRouter.delete("/", authenticateToken, asyncHandler(item.deleteItemCon))
itemRouter.put("/", authenticateToken, asyncHandler(item.editItemCon));
itemRouter.get("/", authenticateToken, asyncHandler(item.getItemsCon))

export default itemRouter;