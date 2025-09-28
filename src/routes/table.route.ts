import { Router } from "express";
import table from "../controllers/table/index.js";
import { authenticateToken } from "../middlawes/auth-token.js";
import { asyncHandler } from "../middlawes/async-handler.js";

const tableRouter: Router = Router();

tableRouter.post("/", authenticateToken, asyncHandler(table.createTableCon));
tableRouter.delete("/", authenticateToken, asyncHandler(table.deleteTableCon));
tableRouter.put("/", authenticateToken, asyncHandler(table.editTableCon));
tableRouter.get("/", authenticateToken, asyncHandler(table.getTablesCon));

export default tableRouter;