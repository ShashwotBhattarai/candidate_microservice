import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { S3Controller } from "../controllers/s3.controller";
import { ValidateHeaderDataMiddleware } from "../middlewares/validateHeaderData.middleware";

const validateKey = new ValidateHeaderDataMiddleware().validateHeaderForKey;
const protectRoute = new AuthGuardMiddleware().protectRoute;

const s3Controller = new S3Controller();
const getS3DefaultUploadUrl =
  s3Controller.getS3DefaultUploadUrl.bind(s3Controller);
const getS3BadBucketUploadUrl =
  s3Controller.getS3BadBucketUploadUrl.bind(s3Controller);

const router: Router = express.Router();

router.get(
  "/getDefaultUploadUrl",
  protectRoute(["candidate"]),
  validateKey,
  getS3DefaultUploadUrl,
);

router.get(
  "/getBadbucketUploadURL",
  protectRoute(["candidate"]),
  validateKey,
  getS3BadBucketUploadUrl,
);

export default router;
