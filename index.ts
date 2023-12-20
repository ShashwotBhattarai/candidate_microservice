import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./src/database/db.connect";
import uploadCandidateInfoRoute from "./src/routes/uploadCandidateInfo.route";

import cors from "cors";

const app = express();
app.use(cors());
const port = 4000;

app.use(bodyParser.json());

connectToDatabase();

app.use("/candidate/upload", uploadCandidateInfoRoute);

app.listen(port, () => {
	console.log(`Candidate Microservice Running at port ${port}`);
});
