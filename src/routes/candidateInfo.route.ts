import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { CandidateController } from "../controllers/candidate.controller";
import { CandidateInfoValidationMiddleware } from "../middlewares/candidateInfoValidation.middleware";
import { ValidateHeaderDataMiddleware } from "../middlewares/validateHeaderData.middleware";

const protectRoute = new AuthGuardMiddleware().protectRoute;

const candidateController = new CandidateController();
const getOneCandidateInfo =
  candidateController.getOneCandidateInfo.bind(candidateController);
const saveCandidateInfo =
  candidateController.saveCandidateInfo.bind(candidateController);
const updateS3FileKey =
  candidateController.updateS3FileKey.bind(candidateController);

const validateCandidateInfo = new CandidateInfoValidationMiddleware()
  .validateCandidateInfo;

const validateHeaderDataMiddleware = new ValidateHeaderDataMiddleware();
const validateKey = validateHeaderDataMiddleware.validateHeaderForKey;
const validateBucketType =
  validateHeaderDataMiddleware.validateHeaderForBucketType;

const router: Router = express.Router();

router.get(
  "/getCandidateInfo/:user_id",
  protectRoute(["candidate"]),
  getOneCandidateInfo,
);

router.post(
  "/saveCandidateInfo",
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
