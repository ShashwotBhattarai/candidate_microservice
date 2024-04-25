import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";

export default class ValidateHeaderDataMiddleware {
  public validateHeaderForKey = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const key = req.headers.s3filekey;

    if (typeof key !== "string") {
      logger.error("invalid header for s3FileKey: " + req.headers.s3filekey);
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      next();
    }
  };

  public validateHeaderForBucketType = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const bucket = req.headers.bucket;

    if (typeof bucket !== "string") {
      logger.error("invalid header for bucket: " + req.headers.bucket);
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      logger.info("header validation for bucket type passed");
      next();
    }
  };
}
