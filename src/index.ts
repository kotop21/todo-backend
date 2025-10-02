import { app } from "./app.js";
// @ts-ignore
import serverless from "serverless-http";

export default serverless(app);
