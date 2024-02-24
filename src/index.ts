import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./configs/db.config";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import cors from "cors";
import logger from "./configs/logger.config";
import rootRoute from "./routes/root.route";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectToDatabase();

app.use("/", rootRoute);

app.listen(port, () => {
  logger.info(`Candidate Microservice Running at port ${port}`);
  logger.info(`API documentation: http://localhost:${port}/doc`);
});
