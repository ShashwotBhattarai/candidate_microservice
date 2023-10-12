// src/routes/userRoutes.ts
import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const router: Router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const authService = new AuthService();
  const authServiceResponse = await authService.registerNewUser(
    req.body.fullname,
    req.body.email,
    req.body.username,
    req.body.password
  );

  res.status(authServiceResponse.status).send(authServiceResponse.message);
});

router.post("/login", async (req: Request, res: Response) => {
  const authService = new AuthService();
  const authServiceResponse = await authService.login(
    req.body.username,
    req.body.password
  );

  res.status(authServiceResponse.status).send(authServiceResponse.message);
});

export default router;
