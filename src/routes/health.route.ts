import express, { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const checkHealth = new HealthController().checkHealth;

const router: Router = express.Router();
router.get("/", checkHealth);

export default router;
