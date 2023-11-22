import { NextFunction, Request, Response } from "express";

export const checkFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded. Please upload your CV" });
  }
  if (req.file.size <= 100000) {
    return res.status(400).json({
      error:
        "File size exceeding 256kb, please make sure your file is less than 256kb in Size",
    });
  }
  next();
};
