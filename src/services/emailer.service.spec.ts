import { EmailerService } from "./emailer.service";
import { EmailPayload } from "../models/emailPayload.type";
import { SQSService } from "./sqs.service";
import { CandidateInfo } from "../entities/candidateInfo.entity";
import { CvUploadStatus } from "../constants/cvUploadStatus.enum";
import { UtilsService } from "./utils.service";
import logger from "../configs/logger.config";

jest.mock("../configs/logger.config");
jest.mock("../entities/candidateInfo.entity");
jest.mock("./sqs.service");
jest.mock("./utils.service");

describe("EmailerService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructEmailPayload", () => {
    it("should construct email payload successfully when CandidateInfo found", async () => {
      const currentUserToken = "userToken";
      const subject = "Test Subject";
      const text = "Test Body";
      const user_id = "45354jj";
      const email = "test@example.com";
      const fullname = "Test User";

      (UtilsService.prototype.findCurrentuserId as jest.Mock).mockReturnValue(
        user_id,
      );

      const response = { email, fullname };
      (CandidateInfo.findOne as jest.Mock).mockResolvedValue(response);

      const emailerService = new EmailerService();
      const result = await emailerService.constructEmailPayload(
        currentUserToken,
        subject,
        text,
      );

      expect(result.to).toBe(email);
      expect(result.subject).toBe(`Hi ${fullname} ${subject}`);
      expect(result.text).toBe(text);
      expect(logger.info).toHaveBeenCalledWith(
        "Email payload created successfully",
      );
    });

    it("should throw an error when CandidateInfo not found", async () => {
      const currentUserToken = "userToken";
      const subject = "Test Subject";
      const text = "Test Body";
      const user_id = "userId";

      // Mocking the findCurrentuserId method of UtilsService
      (UtilsService.prototype.findCurrentuserId as jest.Mock).mockReturnValue(
        user_id,
      );

      // Mocking the findOne method of CandidateInfo to return null
      (CandidateInfo.findOne as jest.Mock).mockResolvedValue(null);

      const emailerService = new EmailerService();
      await expect(
        emailerService.constructEmailPayload(currentUserToken, subject, text),
      ).rejects.toThrowError("error in constructemailpayload");
      expect(logger.error).toHaveBeenCalledWith(
        "Unknown error in constructemailpayload",
        expect.any(Error),
      );
    });
  });

  describe("sendEmail", () => {
    it("should send email successfully with CvUploadSuccessful status", async () => {
      const currentToken = "token";
      const status = CvUploadStatus.CvUploadSuccessful;
      const emailPayload: EmailPayload = {
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test Body",
      };

      // Mocking the constructEmailPayload method of EmailerService
      const constructEmailPayloadSpy = jest.spyOn(
        EmailerService.prototype,
        "constructEmailPayload",
      );
      constructEmailPayloadSpy.mockResolvedValue(emailPayload);

      // Spy on sendMessageToQueue method of SQSService
      const sendMessageToQueueSpy = jest.spyOn(
        SQSService.prototype,
        "sendMessageToQueue",
      );
      sendMessageToQueueSpy.mockResolvedValue({ status: 200 });

      const emailerService = new EmailerService();
      await emailerService.sendEmail(currentToken, status);

      expect(constructEmailPayloadSpy).toHaveBeenCalledWith(
        currentToken,
        expect.any(String),
        expect.any(String),
      );
      expect(sendMessageToQueueSpy).toHaveBeenCalledWith(emailPayload);

      // Restore the original implementation of mocked methods
      constructEmailPayloadSpy.mockRestore();
      sendMessageToQueueSpy.mockRestore();
    });

    it("should send email successfully with CvUploadedToBadBucket status", async () => {
      const currentToken = "token";
      const status = CvUploadStatus.CvUploadedToBadBucket;
      const emailPayload: EmailPayload = {
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test Body",
      };

      // Mocking the constructEmailPayload method of EmailerService
      const constructEmailPayloadSpy = jest.spyOn(
        EmailerService.prototype,
        "constructEmailPayload",
      );
      constructEmailPayloadSpy.mockResolvedValue(emailPayload);

      // Spy on sendMessageToQueue method of SQSService
      const sendMessageToQueueSpy = jest.spyOn(
        SQSService.prototype,
        "sendMessageToQueue",
      );
      sendMessageToQueueSpy.mockResolvedValue({ status: 200 });

      const emailerService = new EmailerService();
      await emailerService.sendEmail(currentToken, status);

      expect(constructEmailPayloadSpy).toHaveBeenCalledWith(
        currentToken,
        expect.any(String),
        expect.any(String),
      );
      expect(sendMessageToQueueSpy).toHaveBeenCalledWith(emailPayload);

      // Restore the original implementation of mocked methods
      constructEmailPayloadSpy.mockRestore();
      sendMessageToQueueSpy.mockRestore();
    });
  });
});
