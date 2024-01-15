import { Request, Response } from "express";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";
import { uploadCandidateInfoController } from "../controllers/uploadCandidateInfo.controller";
import { any } from "joi";

jest.mock("../services/uploadCandidateInfo.service");

describe("uploadCandidateInfoController", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let jsonResponse: any;

	beforeEach(() => {
		jsonResponse = {};
		mockRequest = {
			headers: {
				authorization: "Bearer some-token",
			},
			file: {}, // Mock file object
			body: {}, // Mock body object
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn((result) => {
				jsonResponse = result;
				return mockResponse;
			}),
		};
	});

	it("should handle successful candidate info upload", (done) => {
		const serviceResponse = {
			status: 200,
			message: "Upload successful",
			data: { id: "123", name: "John Doe" },
		};

		uploadCandidateInfoService.mockResolvedValue(serviceResponse);

		uploadCandidateInfoController(mockRequest as Request, mockResponse as Response);

		setImmediate(() => {
			expect(uploadCandidateInfoService).toHaveBeenCalledWith("Bearer some-token", {}, {});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(jsonResponse).toEqual({
				message: serviceResponse.message,
				data: serviceResponse.data,
			});
			done();
		});
	});

	it("should return an error if authorization header is missing", (done) => {
		mockRequest.headers = {};

		uploadCandidateInfoController(mockRequest as Request, mockResponse as Response);

		setImmediate(() => {
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(jsonResponse).toEqual({ error: "Authorization header missing" });
			done();
		});
	});

	// ... other tests ...

	it("should handle internal server error", (done) => {
		uploadCandidateInfoService.mockRejectedValue(new Error("Internal server error"));

		uploadCandidateInfoController(mockRequest as Request, mockResponse as Response);

		setImmediate(() => {
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(jsonResponse).toEqual({ error: "Internal server error" });
			done();
		});
	}, 10000); // Increased timeout
});
