import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./configs/db.config";
import uploadCandidateInfoRoute from "./routes/uploadCandidateInfo.route";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import cors from "cors";
import logger from "./configs/logger.config";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
	origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
const port = 4000;

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectToDatabase();

app.use("/candidate/upload", uploadCandidateInfoRoute);

app.listen(port, () => {
	logger.info(`Candidate Microservice Running at port ${port}`);
	logger.info(`API documentation: http://localhost:4000/doc`);
});
