import logger from "../configs/logger.config";
import { Request, Response } from "express";
import { S3Service } from "../services/s3.service";

export class S3Controller {
  public getS3DefaultUploadUrl(req: Request, res: Response): void {
    (async () => {
      try {
        const key = req.headers.s3filekey as string;
        const { status, message, data } =
          await new S3Service().getS3DefaultUploadUrl(key);
        logger.info("s3 default upload url fetched");

        res.status(status).json({ message: message, url: data });
      } catch {
        logger.error(
          "Unknown error in upload getS3DefaultUploadUrl Controller ",
        );
        res.status(500).json({ error: "Internal server error" });
      }
    })();
  }

  public getS3BadBucketUploadUrl(req: Request, res: Response): void {
    (async () => {
      try {
        const key = req.headers.s3filekey as string;
        const { status, message, data } =
          await new S3Service().getS3BadBucketUploadUrl(key);
        logger.info("upload url for badbucket fetched successfully");

        res.status(status).json({ message: message, url: data });
      } catch {
        logger.error("Unknown error in getS3BadBucketUploadUrl Controller ");
        res.status(500).json({ error: "Internal server error" });
      }
    })();
  }
}
