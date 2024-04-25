import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { envVars } from "./envVars.config";

const app: Express = express();
app.disable("x-powered-by");
const corsOptions = {
  origin: [envVars.ACCESS_CONTROL_ALLOW_ORIGIN_URL as string],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

export default app;
