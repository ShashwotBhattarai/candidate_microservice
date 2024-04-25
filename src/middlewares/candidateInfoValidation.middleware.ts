import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";
import { validateCandidateSchema } from "../constants/candidateValidation.schema";

export class CandidateInfoValidationMiddleware {
  public validateCandidateInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { error } = validateCandidateSchema.validate(req.body, {
      presence: "optional",
    });

    if (error) {
      logger.error(
        "Input validation error in validate candidate middleware",
        error,
      );
      res.status(400).json({ error: error.details[0].message });
    } else {
      logger.info("candidateInfo validation passed");
      next();
    }
  }
}
