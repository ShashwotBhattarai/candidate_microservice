// gateway/src/app.ts
import express from "express";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.routes";
import connectToDatabase from "./database/db.connect";

const app = express();
const port = 3000;

app.use(bodyParser.json());

connectToDatabase();
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
