import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { S3Controller } from "../controllers/s3.controller";
import ValidateHeaderDataMiddleware from "../middlewares/validateHeaderData.middleware";

const router: Router = express.Router();

const getS3DefaultUploadUrl = new S3Controller().getS3DefaultUploadUrl;

const validateKey = new ValidateHeaderDataMiddleware().validateHeaderForKey;

router.get(
  "/",
  authMiddleware(["candidate"]),
  validateKey,
  getS3DefaultUploadUrl,
);

export default router;
