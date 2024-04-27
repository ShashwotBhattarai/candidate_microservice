import express, { Router } from "express";
import { CandidateInfoValidationMiddleware } from "../middlewares/candidateInfoValidation.middleware";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { CandidateController } from "../controllers/candidate.controller";
import { ValidateHeaderDataMiddleware } from "../middlewares/validateHeaderData.middleware";

const protectRoute = new AuthGuardMiddleware().protectRoute;

const validateCandidateInfo = new CandidateInfoValidationMiddleware()
  .validateCandidateInfo;

const validateHeaderDataMiddleware = new ValidateHeaderDataMiddleware();
const validateKey = validateHeaderDataMiddleware.validateHeaderForKey;
const validateBucketType =
  validateHeaderDataMiddleware.validateHeaderForBucketType;

const cadidateController = new CandidateController();
const saveCandidateInfo = cadidateController.saveCandidateInfo;
const updateS3FileKey = cadidateController.updateS3FileKey;

const router: Router = express.Router();
router.post(
  "/",
  protectRoute(["candidate"]),
  validateCandidateInfo,
  saveCandidateInfo,
);
router.post(
  "/updateS3FileKey",
  protectRoute(["candidate"]),
  validateKey,
  validateBucketType,
  updateS3FileKey,
);

export default router;
