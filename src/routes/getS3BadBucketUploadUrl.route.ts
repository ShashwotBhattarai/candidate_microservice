import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { S3Controller } from "../controllers/s3.controller";
import { ValidateHeaderDataMiddleware } from "../middlewares/validateHeaderData.middleware";

const s3Controller = new S3Controller();
const getS3BadBucketUploadUrl =
  s3Controller.getS3BadBucketUploadUrl.bind(s3Controller);
const validateKey = new ValidateHeaderDataMiddleware().validateHeaderForKey;
const protectRoute = new AuthGuardMiddleware().protectRoute;

const router: Router = express.Router();
router.get(
  "/",
  protectRoute(["candidate"]),
  validateKey,
  getS3BadBucketUploadUrl,
);

export default router;
