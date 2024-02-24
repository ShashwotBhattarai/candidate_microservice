import { Response, Request } from "express";
import logger from "../configs/logger.config";

export const healthController = (req: Request, res: Response) => {
  (async function callAuthService() {
    logger.info("Candidate microservice is alive");
    res.status(200).json({ message: "Candidate microservice is alive" });
  })();
};
