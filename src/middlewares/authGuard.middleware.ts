import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../configs/logger.config";
import { envVars } from "../configs/envVars.config";
import { AuthCredentials } from "../entities/authCredentials.entity";

export class AuthGuardMiddleware {
  public protectRoute(allowedRoles: Array<string>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      (async () => {
        if (!req.headers.authorization) {
          logger.info("Authorization header missing");
          return res
            .status(401)
            .json({ message: "Authorization header missing" });
        }

        const token = req.headers.authorization.slice(7);
        if (token == "") {
          logger.info("Access token is missing");
          return res.status(401).json({ message: "Access token is missing" });
        }

        try {
          const decoded = jwt.verify(token, envVars.JWTSECRET as string) as {
            role: string;
            user_id: string;
          };

          const userRole = decoded.role;
          const validUser = await AuthCredentials.findOne({
            user_id: decoded.user_id,
          });
          const validUserRole = validUser?.role;

          if (
            allowedRoles.includes(userRole) &&
            validUser &&
            validUserRole === userRole
          ) {
            logger.info("Access granted");
            next();
          } else {
            logger.info("Access denied");
            return res.status(403).json({ message: "Access denied" });
          }
        } catch (error) {
          logger.error("Unknown Error in Auth middleware", error);
          return res.status(401).json({ message: error });
        }
      })();
    };
  }
}
