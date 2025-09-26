import { Router } from "express";
import table from "../controllers/table/index.js";
import { authenticateToken } from "../middlawes/auth-token.js";

const tableRouter: Router = Router();

tableRouter.post("/create", authenticateToken, table.createTable);
tableRouter.delete("/delete", authenticateToken, table.deleteTable,)

export default tableRouter;