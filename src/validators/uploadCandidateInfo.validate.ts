import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";

const validateCandidateSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(10).max(14),
});

export const validateCandidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = validateCandidateSchema.validate(req.body);
  if (error) {
    logger.info(
      "Input validation error in validate candidate middleware",
      error,
    );
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
