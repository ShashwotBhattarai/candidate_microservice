import express, { Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { uploadCandidateInfoController } from "../controllers/uploadCandidateInfo.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8000000,
  },
});

const router: Router = express.Router();

router.post(
  "/",
  upload.single("cv"),
  authMiddleware(["candidate"]),
  validateCandidate,
  checkFileMiddleware,
  uploadCandidateInfoController,
);

export default router;
