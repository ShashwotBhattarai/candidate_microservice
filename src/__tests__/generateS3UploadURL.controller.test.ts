import * as generateS3UploadURLServiceModule from "../services/generateS3UploadURL.service";
import { generateS3UploadURLController } from "../controllers/generateS3UploadURL.controller";

describe("generateS3UploadURLController", () => {
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
    const generateS3UploadURLServiceModuleSpy = jest.spyOn(
      generateS3UploadURLServiceModule,
      "generateS3UploadURL",
    );
    generateS3UploadURLServiceModuleSpy.mockResolvedValueOnce({
      status: 200,
      message: "upload url created",
      data: "imageUrl",
    });

    mockRequest.headers.authorization = "some-auth-token";
    mockRequest.headers.key = "newkey";

    await generateS3UploadURLController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseObject).toEqual({
      message: "upload url created",
      url: "imageUrl",
    });
  });

  test("missing key header", async () => {
    mockRequest.headers.key = undefined;
    await generateS3UploadURLController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({ error: "Key is missing" });
  });

  test("internal server error", async () => {
    const generateS3UploadURLServiceModuleSpy = jest.spyOn(
      generateS3UploadURLServiceModule,
      "generateS3UploadURL",
    );
    generateS3UploadURLServiceModuleSpy.mockRejectedValueOnce(
      new Error("Internal error"),
    );

    mockRequest.headers.key = "newkey";

    await generateS3UploadURLController(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseObject).toEqual({ error: "Internal server error" });
  });
});
