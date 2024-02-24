import { uploadCandidateInfoController } from "../controllers/uploadCandidateInfo.controller";
import * as uploadCandidateInfoServiceModule from "../services/uploadCandidateInfo.service";

describe("uploadCandidateInfoController", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  let responseObject: unknown = {};

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
    const uploadCandidateInfoServiceModuleSpy = jest.spyOn(
      uploadCandidateInfoServiceModule,
      "uploadCandidateInfoService",
    );
    uploadCandidateInfoServiceModuleSpy.mockResolvedValueOnce({
      status: 200,
      message: "Success",
    });

    mockRequest.headers.authorization = "some-auth-token";

    await uploadCandidateInfoController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseObject).toEqual({ message: "Success" });
  });

  test("missing authorization header", async () => {
    await uploadCandidateInfoController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({ error: "Authorization header missing" });
  });

  test("internal server error", async () => {
    const uploadCandidateInfoServiceModuleSpy = jest.spyOn(
      uploadCandidateInfoServiceModule,
      "uploadCandidateInfoService",
    );
    uploadCandidateInfoServiceModuleSpy.mockRejectedValueOnce(
      new Error("Internal error"),
    );

    mockRequest.headers.authorization = "some-auth-token";

    await uploadCandidateInfoController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseObject).toEqual({ error: "Internal server error" });
  });
});
