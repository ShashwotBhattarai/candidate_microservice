import express, { Router } from "express";
import { CandidateInfoValidationMiddleware } from "../middlewares/candidateInfoValidation.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CandidateController } from "../controllers/candidate.controller";
import ValidateHeaderDataMiddleware from "../middlewares/validateHeaderData.middleware";

const validateCandidateInfo = new CandidateInfoValidationMiddleware()
  .validateCandidateInfo;

const cadidateController = new CandidateController();
const saveCandidateInfo = cadidateController.saveCandidateInfo;
const updateS3FileKey = cadidateController.updateS3FileKey;

const validateHeaderDataMiddleware = new ValidateHeaderDataMiddleware();
const validateKey = validateHeaderDataMiddleware.validateHeaderForKey;
const validateBucketType =
  validateHeaderDataMiddleware.validateHeaderForBucketType;

const router: Router = express.Router();
router.post(
  "/",
  authMiddleware(["candidate"]),
  validateCandidateInfo,
  saveCandidateInfo,
);
router.post(
  "/updateS3FileKey",
  authMiddleware(["candidate"]),
  validateKey,
  validateBucketType,
  updateS3FileKey,
);

export default router;
