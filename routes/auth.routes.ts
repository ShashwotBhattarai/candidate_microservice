// src/routes/userRoutes.ts
import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthCredentials } from "../database/models/authCredentials.models";

const router: Router = express.Router();

// Define a route for user-related operations
router.post("/signup", async (req: Request, res: Response) => {
  
  const result = await AuthCredentials.findOne({ username: req.body.username });
  if (result == null) {
    const authService = new AuthService();
    const status = await authService.registerNewUser(
      req.body.fullname,
      req.body.email,
      req.body.username,
      req.body.password
    );
    res.status(200).send(status);
  } else {
    res.status(400).send({ message: "username already exists" });
  }
});


export default router;
