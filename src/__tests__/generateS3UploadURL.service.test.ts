import { generateS3UploadURL } from "../services/generateS3UploadURL.service";
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("signedUrl"),
}));
describe("generate pload URL from s3", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a signed url", async () => {
    const response = await generateS3UploadURL("testKey");
    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(S3Client),
      expect.anything(),
      { expiresIn: 60 },
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe("signedUrl");
  });
  test("should handle errors when generating a signed URL", async () => {
    const mockError = new Error("Failed to generate signed URL");
    (getSignedUrl as jest.Mock).mockRejectedValue(mockError);

    try {
      await generateS3UploadURL("testKey");
    } catch (error) {
      expect(error).toEqual(new Error("error in generateS3UploadURL"));
    }
  });
});
