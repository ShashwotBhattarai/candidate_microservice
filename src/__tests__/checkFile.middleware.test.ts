import { Request, Response, NextFunction } from "express";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";

describe("checkFileMiddleware", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction;
	let jsonResponse: any;

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
		checkFileMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(jsonResponse).toEqual({ error: "No file uploaded. Please upload your CV" });
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should return an error if file buffer is missing", () => {
		mockRequest.file = {} as Express.Multer.File;

		checkFileMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(jsonResponse).toEqual("File buffer is missing");
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should return an error if file size exceeds the limit", () => {
		mockRequest.file = {
			buffer: Buffer.alloc(256 * 1024 + 1),
			size: 256 * 1024 + 1,

			fieldname: "file",
			originalname: "test.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
		} as Express.Multer.File;

		checkFileMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(jsonResponse).toEqual({
			error: "File size exceeding 256kb, please make sure your file is less than 256kb in Size",
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

		checkFileMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

		expect(nextFunction).toHaveBeenCalled();
	});
});
