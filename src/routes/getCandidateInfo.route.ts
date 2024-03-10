import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getOneCandidateController } from "../controllers/getOneCandidateInfo.controller";

const router: Router = express.Router();

router.get(
  "/:user_id",
  authMiddleware(["candidate"]),
  getOneCandidateController,
);

export default router;
