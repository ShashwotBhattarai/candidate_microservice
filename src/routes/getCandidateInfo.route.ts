import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CandidateController } from "../controllers/candidate.controller";

const router: Router = express.Router();

const getOneCandidate = new CandidateController().getOneCandidate;

router.get("/:user_id", authMiddleware(["candidate"]), getOneCandidate);

export default router;
