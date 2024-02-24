import { Request, Response } from "express";
import { uploadCandidateInfoService } from "../services/uploadCandidateInfo.service";
import logger from "../configs/logger.config";
export const uploadCandidateInfoController = (req: Request, res: Response) => {
  (async () => {
    try {
      if (
        req.headers.authorization !== null &&
        req.headers.authorization !== undefined
      ) {
        const currentToken = req.headers.authorization;
        const { status, message, data } = await uploadCandidateInfoService(
          currentToken,
          req.file,
          req.body,
        );
        logger.info("Candidate info uploaded successfully");

        res.status(status).json({ message: message, data: data });
      } else {
        logger.error("Authorization header missing");
        res.status(400).json({ error: "Authorization header missing" });
      }
    } catch {
      logger.error("Unknown error in upload candidate info controller");
      res.status(500).json({ error: "Internal server error" });
    }
  })();
};
