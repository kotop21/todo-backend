import { app } from "./app.js";
import serverless from "serverless-http";

export default serverless(app);
