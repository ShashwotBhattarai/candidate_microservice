import express, { Router } from "express";
import healthRoute from "./health.route";
import uploadCandidateInfoRoute from "./uploadCandidateInfo.route";

const router: Router = express.Router();

router.use("/health", healthRoute);
router.use("/upload", uploadCandidateInfoRoute);

export default router;
