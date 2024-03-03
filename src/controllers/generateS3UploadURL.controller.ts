import { Request, Response } from "express";
import logger from "../configs/logger.config";
import { generateS3UploadURL } from "../services/generateS3UploadURL.service";
export const generateS3UploadURLController = (req: Request, res: Response) => {
  (async () => {
    try {
      if (req.headers.key == null || req.headers.key == undefined) {
        logger.info("Key is missing");
        return res.status(400).json({ error: "Key is missing" });
      } else {
        const { status, message, data } = await generateS3UploadURL(
          req.headers.key as string,
        );
        logger.info("Candidate info uploaded successfully");

        res.status(status).json({ message: message, url: data });
      }
    } catch {
      logger.error("Unknown error in upload generateS3UploadURLController ");
      res.status(500).json({ error: "Internal server error" });
    }
  })();
};
