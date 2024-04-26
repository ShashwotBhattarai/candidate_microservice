import express, { Router } from "express";
import { AuthGuardMiddleware } from "../middlewares/authGuard.middleware";
import { CandidateController } from "../controllers/candidate.controller";

const router: Router = express.Router();

const getOneCandidate = new CandidateController().getOneCandidate;
const protectRoute = new AuthGuardMiddleware().protectRoute;

router.get("/:user_id", protectRoute(["candidate"]), getOneCandidate);

export default router;
