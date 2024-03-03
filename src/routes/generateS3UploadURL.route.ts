import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generateS3UploadURLController } from "../controllers/generateS3UploadURL.controller";

const router: Router = express.Router();

router.get("/", authMiddleware(["candidate"]), generateS3UploadURLController);

export default router;
