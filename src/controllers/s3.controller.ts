import logger from "../configs/logger.config";
import { Request, Response } from "express";
import { S3Service } from "../services/s3.service";

export class S3Controller {
  private s3Service = new S3Service();
  public getS3DefaultUploadUrl(req: Request, res: Response): void {
    (async (): Promise<void> => {
      try {
        const key = req.headers.s3filekey as string;
        const { status, message, url } =
          await this.s3Service.getS3DefaultUploadUrl(key);
        logger.info("upload url default bucket fetched");

        res.status(status).send({ message: message, url: url });
      } catch {
        logger.error("Unknown error in getS3DefaultUploadUrl controller");
        res.status(500).send({ error: "Internal server error" });
      }
    })();
  }

  public getS3BadBucketUploadUrl(req: Request, res: Response): void {
    (async (): Promise<void> => {
      try {
        const key = req.headers.s3filekey as string;
        const { status, message, data } =
          await this.s3Service.getS3BadBucketUploadUrl(key);
        logger.info("upload url for badbucket fetched successfully");

        res.status(status).send({ message: message, url: data });
      } catch {
        logger.error("Unknown error in getS3BadBucketUploadUrl controller");
        res.status(500).send({ error: "Internal server error" });
      }
    })();
  }
}
