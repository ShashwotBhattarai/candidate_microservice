import { Response, Request } from "express";
import logger from "../configs/logger.config";

export class HealthController {
  public checkHealth(req: Request, res: Response): void {
    ((): void => {
      logger.info("Candidate microservice is alive");
      res.status(200).send({ message: "Candidate microservice is alive" });
    })();
  }
}
