import { uploadCandidateInfoController } from "../controllers/uploadCandidateInfo.controller";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";

jest.mock("../services/uploadCandidateInfo.service");

describe("uploadCandidateInfoController", () => {
	let mockRequest: any;
	let mockResponse: any;
	let responseObject: any = {};

	beforeEach(() => {
		mockRequest = {
			headers: {},
			file: {},
			body: {},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockImplementation((result) => {
				responseObject = result;
			}),
		};
	});

	test("successful execution", async () => {
		const expectedData = { some: "data" };
		uploadCandidateInfoService.mockResolvedValueOnce({
			status: 200,
			message: "Success",
			data: expectedData,
		});

		mockRequest.headers.authorization = "some-auth-token";

		await uploadCandidateInfoController(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(responseObject).toEqual({ message: "Success", data: expectedData });
	});

	test("missing authorization header", async () => {
		await uploadCandidateInfoController(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(responseObject).toEqual({ error: "Authorization header missing" });
	});

	test("internal server error", async () => {
		uploadCandidateInfoService.mockRejectedValueOnce(new Error("Internal error"));

		mockRequest.headers.authorization = "some-auth-token";

		await uploadCandidateInfoController(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(responseObject).toEqual({ error: "Internal server error" });
	});
});
