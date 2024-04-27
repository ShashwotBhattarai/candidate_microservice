import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { S3Controller } from "../controllers/s3.controller";
import { ValidateHeaderDataMiddleware } from "../middlewares/validateHeaderData.middleware";

const getS3DefaultUploadUrl = new S3Controller().getS3DefaultUploadUrl;
const validateKey = new ValidateHeaderDataMiddleware().validateHeaderForKey;
const protectRoute = new AuthGuardMiddleware().protectRoute;

const router: Router = express.Router();
router.get(
  "/",
  protectRoute(["candidate"]),
  validateKey,
  getS3DefaultUploadUrl,
);

export default router;
