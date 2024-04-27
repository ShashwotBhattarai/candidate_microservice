import connectToDatabase from "./configs/db.config";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import logger from "./configs/logger.config";
import rootRoute from "./routes/root.route";
import app from "./configs/express.config";
import { envVars } from "./configs/envVars.config";

connectToDatabase();

app.use("/candidate", rootRoute);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(envVars.PORT, () => {
  logger.info(`Candidate Microservice Running at port ${envVars.PORT}`);
  logger.info(`API documentation: http://localhost:${envVars.PORT}/doc`);
});
