import { S3Service } from "./s3.service";
import { ServiceResponse } from "../models/serviceResponse.type";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("@aws-sdk/client-s3");
jest.mock("../configs/logger.config", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("S3Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getS3DefaultUploadUrl", () => {
    it("should return status:200,message:s3 upload url created,and upload URL when every thing goes well ", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedUploadUrl");

      const result: ServiceResponse =
        await s3Service.getS3DefaultUploadUrl(key);

      expect(result).toEqual({
        status: 200,
        message: "s3 upload url created",
        url: "mockedUploadUrl",
      });
    });

    it("should throw error message:error in generateS3UploadURL, if getSignedUrl fails", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockRejectedValue(
        new Error("Signing URL error"),
      );

      try {
        await s3Service.getS3DefaultUploadUrl(key);
      } catch (error) {
        expect(error).toEqual(new Error("error in generateS3UploadURL"));
      }
    });
  });

  describe("getS3BadBucketUploadUrl", () => {
    it("should return status:200,message:s3 Bad bucket upload url created,and upload URL when every thing goes well ", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedBadBucketUploadUrl");

      const result: ServiceResponse =
        await s3Service.getS3BadBucketUploadUrl(key);

      expect(result).toEqual({
        status: 200,
        message: "s3 Bad bucket upload url created",
        data: "mockedBadBucketUploadUrl",
      });
    });

    it("should throw error message:error in generateS3BadBucketUploadURL, if getSignedUrl fails", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockRejectedValue(
        new Error("Signing URL error"),
      );

      try {
        await s3Service.getS3BadBucketUploadUrl(key);
      } catch (error) {
        expect(error).toEqual(
          new Error("error in generateS3BadBucketUploadURL"),
        );
      }
    });
  });

  describe("getS3DownloadUrl", () => {
    it("should return status:200,message:s3 signedDownload Url fetched,and download URL when every thing goes well ", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedDownloadUrl");

      const result: ServiceResponse = await s3Service.getS3DownloadUrl(key);

      expect(result).toEqual({
        status: 200,
        message: "s3 signedDownload Url fetched",
        url: "mockedDownloadUrl",
      });
    });

    it("should throw error:error in getS3DownloadUrl if getSignedUrl fails", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockRejectedValue(
        new Error("Signing URL error"),
      );

      try {
        await s3Service.getS3DownloadUrl(key);
      } catch (error) {
        expect(error).toEqual(new Error("error in getS3DownloadUrl"));
      }
    });
  });

  describe("deleteFileFromS3", () => {
    it("should returnstatus: 200, message:file deleted from s3 bucket, when everything goes well", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      const response = await s3Service.deleteFileFromS3(key);

      expect(response.status).toEqual(200);
      expect(response.message).toEqual("file deleted from s3 bucket");
    });

    it("should throw error:error in deleteFileFromS3 is file deletion fails", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (DeleteObjectCommand as unknown as jest.Mock).mockImplementation(() => {
        throw new Error("Deletion error");
      });

      await expect(s3Service.deleteFileFromS3(key)).rejects.toThrowError(
        "error in deleteFileFromS3",
      );

      try {
        await s3Service.deleteFileFromS3(key);
      } catch (error) {
        expect(error).toEqual(new Error("error in deleteFileFromS3"));
      }
    });
  });
});
