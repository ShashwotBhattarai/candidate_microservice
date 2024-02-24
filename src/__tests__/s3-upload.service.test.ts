jest.mock("generate-unique-id", () => {
  return {
    __esModule: true, // This is required for modules with no default export
    default: jest.fn().mockReturnValue("mocked-unique-id"),
  };
});

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { uploadFileToS3 } from "../services/s3-upload.service";

describe("S3 file upload service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("file gets uploaded to s3", async () => {
    const s3ClientMock = mockClient(S3Client);
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
    });

    const hexString =
      "255044462d312e370d0a25b5b5b5b50d0a312030206f626a0d0a3c3c2f547970652f436174616c6f672f5061676573203220";
    const mockBuffer = Buffer.from(hexString, "hex");

    const result = await uploadFileToS3(mockBuffer, "application/pdf", "sfsf");

    expect(result.status).toBe(200);
    expect(result.message).toBe("new file uploaded to s3 bucket");
  });

  test("s3 error", async () => {
    mockClient(S3Client).rejects(new Error("s3 error"));
    const hexString =
      "255044462d312e370d0a25b5b5b5b50d0a312030206f626a0d0a3c3c2f547970652f436174616c6f672f5061676573203220";
    const mockBuffer = Buffer.from(hexString, "hex");

    try {
      await uploadFileToS3(mockBuffer, "application/pdf", "sfsf");
    } catch (error) {
      expect(error).toEqual(new Error("error in uploadFileToS3"));
    }
  });
});
