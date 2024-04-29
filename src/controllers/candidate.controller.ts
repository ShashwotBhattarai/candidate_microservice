import { Request, Response } from "express";
import logger from "../configs/logger.config";
import { CandidateService } from "../services/candidate.service";

export class CandidateController {
  private candidateService = new CandidateService();

  public saveCandidateInfo(req: Request, res: Response): void {
    (async (): Promise<void> => {
      try {
        const currentToken = req.headers.authorization as string;

        const response = await this.candidateService.saveUserDetailsToDatabase(
          req.body,
          currentToken,
        );

        logger.info("Candidate info saved successfully");

        res.status(response.status).send({ message: response.message });
      } catch {
        logger.error("Unknown error in save candidate info controller");
        res.status(500).send({ error: "Internal server error" });
      }
    })();
  }

  public getOneCandidateInfo(req: Request, res: Response): void {
    (async (): Promise<void> => {
      try {
        const user_id = req.params.user_id;
        const response =
          await this.candidateService.getOneCandidateInfo(user_id); //same name?
        res.status(response.status).send({
          message: response.message,
          data: response.data,
          url: response.url,
        });
      } catch (error) {
        logger.error("Unknown error in getOneCandidateController", error);
        res.status(500).send({ error: "Internal server error" });
      }
    })();
  }

  public updateS3FileKey(req: Request, res: Response): void {
    (async (): Promise<void> => {
      try {
        const key = req.headers.s3filekey as string;
        let accessToken = req.headers.authorization as string;
        accessToken = accessToken.slice(7);

        const bucket = req.headers.bucket as string;

        const response = await this.candidateService.updateS3FileKeyInDatabase(
          accessToken,
          key,
          bucket,
        );
        res.status(response.status).send({
          message: response.message,
        });
      } catch (error) {
        logger.error("Unknown error in updateS3FileKey controller", error);
        res.status(500).send({ error: "Internal server error" });
      }
    })();
  }
}
