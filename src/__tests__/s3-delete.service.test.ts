import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { deleteFileFromS3 } from "../services/s3-delete.service";

describe("S3 file delete service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("file gets deleted from s3", async () => {
    const s3ClientMock = mockClient(S3Client);
    s3ClientMock.on(DeleteObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
    });

    const result = await deleteFileFromS3("fasjf546");

    expect(result.status).toBe(200);
  });

  test("s3 error", async () => {
    mockClient(S3Client).rejects(new Error("s3 error"));

    try {
      await deleteFileFromS3("fasjf546");
    } catch (error) {
      expect(error).toEqual(new Error("error in deleteFileFromS3"));
    }
  });
});
