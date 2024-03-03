import express, { Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadCandidateInfoController } from "../controllers/uploadCandidateInfo.controller";

const router: Router = express.Router();

router.post(
  "/",
  authMiddleware(["candidate"]),
  validateCandidate,
  uploadCandidateInfoController,
);

export default router;
