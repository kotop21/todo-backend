import { Router } from "express";
import item from "../controllers/item/index.js";
import { authenticateToken } from "../middlawes/auth-token.js";

const itemRouter: Router = Router();

itemRouter.post("/", authenticateToken, item.addItemCon);
itemRouter.delete("/", authenticateToken, item.deleteItemCon)
itemRouter.put("/", authenticateToken, item.editItemCon);
itemRouter.get("/", authenticateToken, item.getItemsCon)

export default itemRouter;