import express, { Router } from "express";
import healthRoute from "./health.route";
import candidateInfoRoute from "./candidateInfo.route";
import s3Route from "./s3.route";

const router: Router = express.Router();

router.use("/health", healthRoute);
router.use("/candidateInfo", candidateInfoRoute);
router.use("/s3", s3Route);

export default router;
