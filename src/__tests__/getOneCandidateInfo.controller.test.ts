import { Request, Response } from "express";
import { getOneCandidateController } from "../controllers/getOneCandidateInfo.controller";
import { CandidateInfo } from "../models/candidateInfo.model";
import { downloadFileFromS3 } from "../services/s3-fileDownload.service";

jest.mock("../models/candidateInfo.model");
jest.mock("../services/s3-fileDownload.service", () => ({
  downloadFileFromS3: jest.fn(),
}));
jest.mock("../configs/logger.config", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("getOneCandidateController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jsonResponse: any;

  beforeEach(() => {
    mockRequest = {
      params: {
        user_id: "testUserId",
      },
    };

    jsonResponse = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((result) => (jsonResponse = result)),
      json: jest.fn().mockImplementation((result) => (jsonResponse = result)),
    };

    jest.clearAllMocks();
  });

  it("should download file and return candidate info when candidate and key are found", (done) => {
    CandidateInfo.findOne = jest.fn().mockResolvedValue({
      user_id: "testUserId",
      aws_file_key: "testFileKey",
    });

    (downloadFileFromS3 as jest.Mock).mockResolvedValue({
      status: 200,
      message: "ok",
      data: "testFileUrl",
    });

    getOneCandidateController(mockRequest as Request, mockResponse as Response);

    setImmediate(() => {
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonResponse).toEqual({
        candidate: { user_id: "testUserId", aws_file_key: "testFileKey" },
        url: "testFileUrl",
      });
      done();
    });
  });

  it("should return candidate info with null URL when candidate is found but key is missing", async () => {
    CandidateInfo.findOne = jest.fn().mockResolvedValue({
      user_id: "testUserId",
    });

    await getOneCandidateController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(jsonResponse).toEqual({
      candidate: { user_id: "testUserId" },
      url: null,
    });
  });

  it("should return a 404 when candidate is not found", async () => {
    CandidateInfo.findOne = jest.fn().mockResolvedValue(null);

    await getOneCandidateController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(jsonResponse).toEqual({
      message: "Either Candidate with that user_id not found or key not found",
    });
  });

  it("should handle errors", async () => {
    CandidateInfo.findOne = jest
      .fn()
      .mockRejectedValue(new Error("Error fetching candidate"));

    await getOneCandidateController(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(jsonResponse).toEqual({ error: "internal server error" });
  });
});
