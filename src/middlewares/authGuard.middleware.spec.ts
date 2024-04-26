import request from "supertest";
import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { AuthGuardMiddleware } from "./authGuard.middleware";
import { AuthCredentials } from "../entities/authCredentials.entity";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("../entities/authCredentials.entity", () => ({
  AuthCredentials: {
    findOne: jest.fn(),
  },
}));

describe("AuthGuardMiddleware", () => {
  let app: Express;
  let authGuardMiddleware: AuthGuardMiddleware;

  beforeEach(() => {
    app = express();
    authGuardMiddleware = new AuthGuardMiddleware();

    jest.mock("../configs/logger.config", () => ({
      error: jest.fn(),
    }));

    app.get(
      "/protected-route",
      authGuardMiddleware.protectRoute(["admin"]),
      (req, res) => {
        res.status(200).json({ message: "Access granted to protected route" });
      },
    );
  });

  it("should respond with 401 and Authorization header missing message if authorization header is missing", async () => {
    const response = await request(app).get("/protected-route");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("should respond with 401 and Access token is missing message if access token is missing", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", "Bearer ");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token is missing");
  });

  it("should respond with 403 and Access denied message if user role is not allowed", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "user" });

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("should respond with 401 and Database error message if database query fails", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "admin" });
    (AuthCredentials.findOne as jest.Mock).mockRejectedValueOnce(
      new Error("Database error"),
    );

    const token = "mockedToken";

    try {
      await request(app)
        .get("/protected-route")
        .set("Authorization", `Bearer ${token}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.status).toBe(401);
      expect(error.message).toEqual(new Error("Database error"));
    }
  });

  it("should allow access if user role is allowed and respond with 200 Access granted to protected route message", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "admin" });
    (AuthCredentials.findOne as jest.Mock).mockResolvedValueOnce({
      role: "admin",
    });

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted to protected route");
  });

  it("should decline access if user not found in db", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "admin" });
    (AuthCredentials.findOne as jest.Mock).mockResolvedValueOnce(null);

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("should decline access if role in db and token doesnt match", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "admin" });
    (AuthCredentials.findOne as jest.Mock).mockResolvedValueOnce({
      role: "user",
    });

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
});
