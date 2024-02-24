import { Request, Response } from "express";
import { healthController } from "../controllers/health.controller";

describe("health controller", () => {
  let mockRequest: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  let jsonResponse: unknown;

  beforeEach(() => {
    mockRequest = {};

    jsonResponse = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        jsonResponse = result;
      }),
    };

    jest.clearAllMocks();
  });

  it("should return a health ok response", async () => {
    await healthController(
      mockRequest as unknown as Request,
      mockResponse as unknown as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(jsonResponse).toEqual({
      message: "Candidate microservice is alive",
    });
  });
});
