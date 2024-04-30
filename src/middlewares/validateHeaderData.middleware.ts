import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";

export class ValidateHeaderDataMiddleware {
  public validateHeaderForKey = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.headers.s3filekey) {
      logger.info("s3filekey header missing");
      res.status(401).send({ message: "Invalid credentials" });
    }

    const key = req.headers.s3filekey;

    if (typeof key !== "string") {
      logger.error("invalid header for s3FileKey: " + req.headers.s3filekey);
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      logger.info("header validation for s3FileKey passed");
      next();
    }
  };

  public validateHeaderForBucketType = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.headers.bucket) {
      logger.info("bucket header missing");
      res.status(401).send({ message: "Invalid credentials" });
    }

    const bucket = req.headers.bucket;
    const bucketTypes = ["default", "bad"];

    if (typeof bucket !== "string") {
      logger.error("bucket header not string: " + req.headers.bucket);
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else if (!bucketTypes.includes(bucket)) {
      logger.error("bucket header not allowed: " + req.headers.bucket);
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      logger.info("header validation for bucket type passed");
      next();
    }
  };
}
