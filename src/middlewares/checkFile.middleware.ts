import { NextFunction, Request, Response } from "express";
import logger from "../configs/logger.config";

export const checkFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    logger.info("No file uploaded.");
    return res
      .status(400)
      .json({ error: "No file uploaded. Please upload your CV" });
  }
  if (!req.file.buffer) {
    logger.info("File buffer is missing");
    return res.status(400).json("File buffer is missing");
  }
  if (req.file.size > 3 * 1024 * 1024) {
    logger.info("File size exceeding 3mb");
    return res.status(400).json({
      error:
        "File size exceeding 3mb, please make sure your file is less than 3mb in Size",
    });
  }
  next();
};
