// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");
import { CandidateService } from "./candidate.service";
import { CandidateInfo } from "../entities/candidateInfo.entity";
import { S3Service } from "./s3.service";
import { EmailerService } from "./emailer.service";
import { UtilsService } from "./utils.service";
import logger from "../configs/logger.config";
import { UpdateWriteOpResult } from "mongoose";

jest.mock("../entities/candidateInfo.entity");
jest.mock("./s3.service");
jest.mock("./emailer.service");
jest.mock("../configs/logger.config");

let candidateService: CandidateService;

describe("CandidateService", () => {
  beforeEach(() => {
    candidateService = new CandidateService();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("getOneCandidate", () => {
    it("should return candidate data and download URL when candidate and key are found", async () => {
      const mockCandidate = {
        user_id: "123",
        s3_default_bucket_file_key: "file_key",
      };
      const mockDownloadUrl = "http://example.com/download";

      const findOneSpy = jest
        .spyOn(CandidateInfo, "findOne")
        .mockResolvedValueOnce(mockCandidate);
      const getS3DownloadUrlSpy = jest
        .spyOn(S3Service.prototype, "getS3DownloadUrl")
        .mockResolvedValueOnce({
          status: 200,
          data: mockDownloadUrl,
          message: "sdfsdf",
        });

      const result = await candidateService.getOneCandidate("123");

      expect(findOneSpy).toHaveBeenCalledWith({ user_id: "123" });
      expect(getS3DownloadUrlSpy).toHaveBeenCalledWith("file_key");
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockCandidate);
      expect(result.message).toBe("Candidate and CV found");
      expect(result.url).toBe(mockDownloadUrl);
    });

    it("should return candidate data when candidate is found but key is not found", async () => {
      const mockCandidate = { user_id: "123" };

      jest.spyOn(CandidateInfo, "findOne").mockResolvedValueOnce(mockCandidate);

      const result = await candidateService.getOneCandidate("123");

      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockCandidate);
      expect(result.message).toBe("candidate found but CV not found");
    });

    it("should return 404 status when candidate is not found", async () => {
      jest.spyOn(CandidateInfo, "findOne").mockResolvedValueOnce(null);

      const result = await candidateService.getOneCandidate("123");

      expect(result.status).toBe(404);
      expect(result.message).toBe(
        "Either Candidate with that user_id not found or key not found",
      );
      expect(logger.info).toHaveBeenCalledWith(
        "Either Candidate with that user_id not found or key not found",
      );
    });

    it("should return 500 status when an unknown error occurs", async () => {
      jest
        .spyOn(CandidateInfo, "findOne")
        .mockRejectedValueOnce(new Error("Test error"));

      const result = await candidateService.getOneCandidate("123");

      expect(result.status).toBe(500);
      expect(result.message).toBe("Unknown error in getOneCandidateController");
    });
  });

  describe("saveUserDetailsToDatabase", () => {
    it("should save candidate details to database and return success message", async () => {
      const mockBody = {
        fullname: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
      };
      const mockAccessToken = "mockAccessToken";
      const mockCurrentUserId = "123";

      const findCurrentUserIdSpy = jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);
      const findOneAndUpdateSpy = jest
        .spyOn(CandidateInfo, "findOneAndUpdate")
        .mockResolvedValueOnce({});

      const result = await candidateService.saveUserDetailsToDatabase(
        mockBody,
        mockAccessToken,
      );

      expect(findCurrentUserIdSpy).toHaveBeenCalledWith(mockAccessToken);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { user_id: mockCurrentUserId },
        expect.any(Object),
        { upsert: true, new: true },
      );
      expect(result.status).toBe(200);
      expect(result.message).toBe("Candidate details saved successfully");
    });

    it("should save candidate details with createdBy field when candidate does not exist", async () => {
      const mockBody = {
        fullname: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
      };
      const mockAccessToken = "mockAccessToken";
      const mockCurrentUserId = "123";

      const findCurrentUserIdSpy = jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);
      const findOneAndUpdateSpy = jest
        .spyOn(CandidateInfo, "findOneAndUpdate")
        .mockResolvedValueOnce(null);

      const result = await candidateService.saveUserDetailsToDatabase(
        mockBody,
        mockAccessToken,
      );

      expect(findCurrentUserIdSpy).toHaveBeenCalledWith(mockAccessToken);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { user_id: mockCurrentUserId },
        expect.objectContaining({ createdBy: mockCurrentUserId }),
        { upsert: true, new: true },
      );
      expect(result.status).toBe(200);
      expect(result.message).toBe("Candidate details saved successfully");
    });

    it("should throw an error and log when an error occurs", async () => {
      const mockBody = {
        fullname: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
      };
      const mockAccessToken = "mockAccessToken";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockImplementationOnce(() => {
          throw new Error("Test error");
        });

      await expect(
        candidateService.saveUserDetailsToDatabase(mockBody, mockAccessToken),
      ).rejects.toThrow("error in saveUserDetailsToDatabase");
    });
  });

  describe("findSavedS3key", () => {
    it("should return status 204 and message when old file key is not found", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockCurrentUserId = "123";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);

      jest
        .spyOn(CandidateInfo, "findOne")
        .mockResolvedValueOnce({ user_id: mockCurrentUserId });

      const result = await candidateService.findSavedS3key(mockAccessToken);

      expect(result.status).toBe(204);
      expect(result.message).toBe("old file key not found");
      expect(result.data).toBeNull();
    });

    it("should return status 200, message, and data when old file key is found", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockCurrentUserId = "123";
      const mockFileKey = "file_key";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);

      jest.spyOn(CandidateInfo, "findOne").mockResolvedValueOnce({
        user_id: mockCurrentUserId,
        s3_default_bucket_file_key: mockFileKey,
      });

      const result = await candidateService.findSavedS3key(mockAccessToken);

      expect(result.status).toBe(200);
      expect(result.message).toBe("old file key found");
      expect(result.data).toBe(mockFileKey);
    });

    it("should throw an error and log when an unknown error occurs", async () => {
      const mockAccessToken = "mockAccessToken";

      jest.spyOn(CandidateInfo, "findOne").mockResolvedValueOnce(null);

      try {
        await candidateService.findSavedS3key(mockAccessToken);
      } catch (err) {
        expect(err).toEqual(new Error("error in findSavedS3key"));
      }
    });

    it("should throw an error and log when an unknown error occurs", async () => {
      const mockAccessToken = "mockAccessToken";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockImplementationOnce(() => {
          throw new Error("Test error");
        });

      try {
        await candidateService.findSavedS3key(mockAccessToken);
      } catch (err) {
        expect(err).toEqual(new Error("error in findSavedS3key"));
      }
    });
    it("should throw an error if querying CandidateInfo fails", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockCurrentUserId = "123";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);
      jest.spyOn(CandidateInfo, "findOne").mockResolvedValueOnce(null);

      try {
        await candidateService.findSavedS3key(mockAccessToken);
      } catch {
        expect(logger.error).toHaveBeenCalledWith(
          "Unknown error in findSavedS3key",
          new Error("unkown error in querring candidateInfo"),
        );
      }
    });
  });

  describe("updateS3FileKeyInDatabase", () => {
    it("should update default bucket file key and send email for successful upload", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockNewKey = "new_file_key";
      const mockCurrentUserId = "123";
      const mockFindSavedS3keyResponse = {
        status: 200,
        data: "old_file_key",
        message: "oldkey found",
      };

      jest.mock("./candidate.service");

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);

      jest
        .spyOn(CandidateService.prototype, "findSavedS3key")
        .mockResolvedValueOnce(mockFindSavedS3keyResponse);
      jest
        .spyOn(S3Service.prototype, "deleteFileFromS3")
        .mockResolvedValueOnce({
          status: 200,
          message: "file deleted from s3",
        });

      //this type was introduced to get rid of typescript error, turns our mockResolvedValueOnce in case of updateOne returns specific data type
      type MockUpdateResult = UpdateWriteOpResult & {
        n?: number;
        nModified?: number;
        ok?: number;
      };

      jest.spyOn(CandidateInfo, "updateOne").mockResolvedValueOnce({
        n: 1,
        nModified: 1,
        ok: 1,
      } as MockUpdateResult);
      jest.spyOn(EmailerService.prototype, "sendEmail").mockResolvedValueOnce;

      const result = await candidateService.updateS3FileKeyInDatabase(
        mockAccessToken,
        mockNewKey,
        "default",
      );

      expect(result.status).toBe(200);
      expect(result.message).toBe("Aws key updated successfully");
    });

    it("should update bad bucket file key and send email for successful upload", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockNewKey = "new_file_key";
      const mockCurrentUserId = "123";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockReturnValueOnce(mockCurrentUserId);
      jest
        .spyOn(candidateService, "findSavedS3key")
        .mockResolvedValueOnce({ status: 204, message: "" });
      jest.spyOn(CandidateInfo, "findOneAndUpdate").mockResolvedValueOnce({});
      jest.spyOn(EmailerService.prototype, "sendEmail").mockResolvedValueOnce;

      const result = await candidateService.updateS3FileKeyInDatabase(
        mockAccessToken,
        mockNewKey,
        "bad",
      );

      expect(result.status).toBe(200);
      expect(result.message).toBe("Aws key updated successfully");
      expect(logger.info).toHaveBeenCalledWith(
        "s3_bad_bucket key updated in database successfully",
      );
    });

    it("should throw an error and log when an unknown error occurs", async () => {
      const mockAccessToken = "mockAccessToken";
      const mockNewKey = "new_file_key";

      jest
        .spyOn(UtilsService.prototype, "findCurrentuserId")
        .mockImplementationOnce(() => {
          throw new Error("Test error");
        });

      await expect(
        candidateService.updateS3FileKeyInDatabase(
          mockAccessToken,
          mockNewKey,
          "default",
        ),
      ).rejects.toThrow("error in updateAwsKeyInDatabase");
    });
  });
});
