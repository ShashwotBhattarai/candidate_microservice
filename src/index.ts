import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./database/db.connect";
import uploadCandidateInfoRoute from "./routes/uploadCandidateInfo.route";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import cors from "cors";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
	origin: "http://localhost:3000/",
};
app.use(cors(corsOptions));
const port = 4000;

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectToDatabase();

app.use("/candidate/upload", uploadCandidateInfoRoute);

app.listen(port, () => {
	console.log(`Candidate Microservice Running at port ${port} \n API documentation: http://localhost:4000/doc`);
});
