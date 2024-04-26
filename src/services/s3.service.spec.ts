import { S3Service } from "./s3.service";
import { ServiceResponse } from "../models/serviceResponse.type";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
    it("should return upload URL with correct parameters", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedUploadUrl");

      const result: ServiceResponse =
        await s3Service.getS3DefaultUploadUrl(key);

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(PutObjectCommand),
        expect.any(Object),
      );
      expect(result).toEqual({
        status: 200,
        message: "upload url created",
        data: "mockedUploadUrl",
      });
    });

    it("should throw error if signing URL fails", async () => {
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
    it("should return upload URL with correct parameters", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedBadBucketUploadUrl");

      const result: ServiceResponse =
        await s3Service.getS3BadBucketUploadUrl(key);

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(PutObjectCommand),
        expect.any(Object),
      );
      expect(result).toEqual({
        status: 200,
        message: "Bad bucket upload url created",
        data: "mockedBadBucketUploadUrl",
      });
    });

    it("should throw error if signing URL fails", async () => {
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
    it("should return download URL with correct parameters", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockResolvedValue("mockedDownloadUrl");

      const result: ServiceResponse = await s3Service.getS3DownloadUrl(key);

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(GetObjectCommand),
        expect.any(Object),
      );
      expect(result).toEqual({
        status: 200,
        message: "url downloaded",
        data: "mockedDownloadUrl",
      });
    });

    it("should throw error if signing URL fails", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      (getSignedUrl as jest.Mock).mockRejectedValue(
        new Error("Signing URL error"),
      );

      try {
        await s3Service.getS3DownloadUrl(key);
      } catch (error) {
        expect(error).toEqual(new Error("error in downloadFileFromS3"));
      }
    });
  });

  describe("deleteFileFromS3", () => {
    it("should delete file from S3 with correct parameters", async () => {
      const s3Service = new S3Service();
      const key = "testKey";

      await s3Service.deleteFileFromS3(key);

      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: expect.any(String),
        Key: key,
      });
    });

    it("should throw error if deletion fails", async () => {
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
