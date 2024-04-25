import express, { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router: Router = express.Router();

const checkHealth = new HealthController().checkHealth;

router.get("/", checkHealth);

export default router;
