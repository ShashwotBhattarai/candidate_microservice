import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { CandidateController } from "../controllers/candidate.controller";

const candidateController = new CandidateController();
const getOneCandidateInfo =
  candidateController.getOneCandidateInfo.bind(candidateController);
const protectRoute = new AuthGuardMiddleware().protectRoute;

const router: Router = express.Router();
router.get("/:user_id", protectRoute(["candidate"]), getOneCandidateInfo);

export default router;
