// src/routes/userRoutes.ts
import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthCredentials } from "../database/models/authCredentials.models";

const router: Router = express.Router();

// Define a route for user-related operations
router.post("/signup", async (req: Request, res: Response) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const result = await AuthCredentials.findOne({ username: username });
  if (result == null) {
    const authService = new AuthService();
    const status = await authService.registerNewUser(
      fullname,
      email,
      username,
      password
    );
    res.json(status);
  } else {
    res.status(400).send({ message: "username already exists" });
  }
});


export default router;
