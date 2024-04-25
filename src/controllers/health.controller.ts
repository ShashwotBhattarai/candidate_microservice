import { Response, Request } from "express";
import logger from "../configs/logger.config";

export class HealthController {
  public checkHealth(req: Request, res: Response) {
    (async () => {
      logger.info("Candidate microservice is alive");
      res.status(200).json({ message: "Candidate microservice is alive" });
    })();
  }
}
