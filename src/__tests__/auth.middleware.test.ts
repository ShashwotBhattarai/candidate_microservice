import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("authMiddleware", () => {
  const mockRequest = (token: string | undefined | null) =>
    ({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    }) as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access for valid token and authorized role", () => {
    const req = mockRequest("validToken");
    const res = mockResponse();
    const allowedRoles = ["admin"];

    (jwt.verify as jest.Mock).mockReturnValue({ role: "admin" });

    authMiddleware(allowedRoles)(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should deny access for valid token and unauthorized role", () => {
    const req = mockRequest("validToken");
    const res = mockResponse();
    const allowedRoles = ["admin"];

    (jwt.verify as jest.Mock).mockReturnValue({ role: "user" });

    authMiddleware(allowedRoles)(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should deny access for invalid token", () => {
    const req = mockRequest("invalidToken");
    const res = mockResponse();
    const allowedRoles = ["admin"];

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(allowedRoles)(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should deny access if token is missing", () => {
    const req = {
      headers: {
        authorization: `Bearer `,
      },
    } as Request;
    const res = mockResponse();
    const allowedRoles = ["admin"];

    authMiddleware(allowedRoles)(req, res, mockNext);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should deny authorization header missing", () => {
    const req = {
      headers: {},
    } as Request;
    const res = mockResponse();
    const allowedRoles = ["admin"];

    authMiddleware(allowedRoles)(req, res, mockNext);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
