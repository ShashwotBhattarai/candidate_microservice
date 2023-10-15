import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(allowedRoles: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.slice(7);

    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET as string) as {
        role: string;
      };

      const userRole = decoded.role;
      

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  };
}
