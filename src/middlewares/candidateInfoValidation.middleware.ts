import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";
import { validateCandidateSchema } from "../validators/candidateValidation.schema";

export class CandidateInfoValidationMiddleware {
  public validateCandidateInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { error } = validateCandidateSchema.validate(req.body);

    if (error) {
      logger.error(
        "Input validation error in validate candidateInfo middleware",
        error,
      );
      res.status(400).send({ error: error.details[0].message });
    } else {
      logger.info("candidateInfo validation passed");
      next();
    }
  }
}
