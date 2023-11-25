import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./database/db.connect";
import uploadCandidateInfoRoute from "./routes/uploadCandidateInfo.route";
import getCandidateInfoRoute from "./routes/getCadidateInfoRoute";
import cors from "cors";
import { SQS_Service } from "./services/sqs.service";

const app = express();
app.use(cors());
const port = 4000;

app.use(bodyParser.json());

connectToDatabase();

app.use("/upload", uploadCandidateInfoRoute);
app.use("/getCandidateInfo", getCandidateInfoRoute);

app.listen(port, () => {
  console.log(`Candidate Microservice Running at port ${port}`);
});
