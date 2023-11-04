// src/routes/userRoutes.ts
import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateSignupInput } from "../validators/signup.validate";

const router: Router = express.Router();

router.post("/signup", async (req: Request, res: Response)=> {
  const { error} = validateSignupInput.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
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

  res.status(authServiceResponse.status).json({message:authServiceResponse.message});
});

export default router;
