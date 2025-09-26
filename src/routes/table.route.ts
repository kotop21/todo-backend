import { Router } from "express";
import table from "../controllers/table/index.js";
import { authenticateToken } from "../middlawes/auth-token.js";
const tableRouter: Router = Router();


tableRouter.post("/", authenticateToken, table.createTableCon);
tableRouter.delete("/", authenticateToken, table.deleteTableCon);
tableRouter.put("/", authenticateToken, table.editTableCon);
tableRouter.get("/", authenticateToken, table.getTablesCon);

export default tableRouter;