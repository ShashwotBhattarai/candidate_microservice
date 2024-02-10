import express, { Router } from "express";
import { healthController } from "../controllers/health.controller";

const router: Router = express.Router();

router.get("/", healthController);

export default router;
