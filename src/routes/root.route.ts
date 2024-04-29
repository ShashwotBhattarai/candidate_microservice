import express, { Router } from "express";
import healthRoute from "./health.route";
import saveCandidateInfoRoute from "./saveCandidateInfo.route";
import getS3DefaultUploadURL from "./getS3DefaultUploadUrl.route";
import getCandidateInfoRoute from "./getCandidateInfo.route";
import getS3BadBucketUploadURL from "./getS3BadBucketUploadUrl.route";

const router: Router = express.Router();

router.use("/health", healthRoute);
router.use("/saveCandidateInfo", saveCandidateInfoRoute);
router.use("/getCandidateInfo", getCandidateInfoRoute);
router.use("/defaultUploadUrl", getS3DefaultUploadURL);
router.use("/badbucketUploadURL", getS3BadBucketUploadURL);

export default router;
