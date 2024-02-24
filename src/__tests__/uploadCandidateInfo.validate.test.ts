import { Request, Response, NextFunction } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate"; // Adjust the import path

describe("validateCandidate", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jsonResponse: any;

  beforeEach(() => {
    jsonResponse = {};
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => (jsonResponse = result)),
    };
    mockNext = jest.fn();
  });

  it("should call next for valid request body", () => {
    mockRequest.body = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      phone_number: "1234567890",
    };

    validateCandidate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return an error for invalid request body", () => {
    mockRequest.body = {
      fullname: "JD", // Too short to pass validation
      email: "invalid-email",
      phone_number: "123", // Too short to pass validation
    };

    validateCandidate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse.error).toBeDefined();
    expect(mockNext).not.toHaveBeenCalled();
  });
});
