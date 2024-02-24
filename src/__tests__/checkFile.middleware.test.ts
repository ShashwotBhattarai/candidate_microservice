import { Request, Response, NextFunction } from "express";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";

describe("checkFileMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let jsonResponse: unknown;

  beforeEach(() => {
    jsonResponse = {};
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => (jsonResponse = result)),
    };
    nextFunction = jest.fn();
  });

  it("should return an error if no file is uploaded", () => {
    checkFileMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toEqual({
      error: "No file uploaded. Please upload your CV",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return an error if file buffer is missing", () => {
    mockRequest.file = {} as Express.Multer.File;

    checkFileMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toEqual("File buffer is missing");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return an error if file size exceeds the limit", () => {
    mockRequest.file = {
      buffer: Buffer.alloc(256 * 256 * 256 * 3 + 1),
      size: 256 * 256 * 256 * 3,

      fieldname: "file",
      originalname: "test.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
    } as Express.Multer.File;

    checkFileMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toEqual({
      error:
        "File size exceeding 3mb, please make sure your file is less than 3mb in Size",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should call next() for valid file", () => {
    mockRequest.file = {
      buffer: Buffer.alloc(100000),
      size: 100000,
      fieldname: "file",
      originalname: "test.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
    } as Express.Multer.File;

    checkFileMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
  });
});
