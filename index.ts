import express from "express";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.routes";
import connectToDatabase from "./database/db.connect";
import uploadCandidateInfoRoute from "./routes/uploadCandidateInfo.route";
import getCandidateInfoRoute from "./routes/getCadidateInfoRoute";

const app = express();
const port = 3000;

app.use(bodyParser.json());

connectToDatabase();
app.use("/auth", authRoute);
app.use("/upload", uploadCandidateInfoRoute)
app.use("/getCandidateInfo",getCandidateInfoRoute)

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
