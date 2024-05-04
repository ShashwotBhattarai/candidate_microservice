import { EmailerService } from "./emailer.service";
import { EmailPayload } from "../models/emailPayload.type";
import { SQSService } from "./sqs.service";
import { CandidateInfo } from "../entities/candidateInfo.entity";
import { CvUploadStatus } from "../constants/cvUploadStatus.enum";
import { UtilsService } from "./utils.service";

jest.mock("../configs/logger.config");
jest.mock("../entities/candidateInfo.entity");
jest.mock("./sqs.service");
jest.mock("./utils.service");

describe("EmailerService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructEmailPayload", () => {
    it("should construct email payload according to the params passsed", async () => {
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
    });

    it("should throw an error:error in constructEmailPayload, when CandidateInfo not found", async () => {
      const currentUserToken = "userToken";
      const subject = "Test Subject";
      const text = "Test Body";
      const user_id = "userId";

      (UtilsService.prototype.findCurrentuserId as jest.Mock).mockReturnValue(
        user_id,
      );

      (CandidateInfo.findOne as jest.Mock).mockResolvedValue(null);

      const emailerService = new EmailerService();
      await expect(
        emailerService.constructEmailPayload(currentUserToken, subject, text),
      ).rejects.toThrow("error in constructEmailPayload");
    });
  });

  describe("sendEmail", () => {
    it("should responde with status:200 when message is sent to queue", async () => {
      const currentToken = "token";
      const status = CvUploadStatus.CV_UPLOAD_SUCCESSFUL;
      const emailPayload: EmailPayload = {
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test Body",
      };

      const constructEmailPayloadSpy = jest.spyOn(
        EmailerService.prototype,
        "constructEmailPayload",
      );
      constructEmailPayloadSpy.mockResolvedValue(emailPayload);

      const sendMessageToQueueSpy = jest.spyOn(
        SQSService.prototype,
        "sendMessageToQueue",
      );
      sendMessageToQueueSpy.mockResolvedValue({
        status: 200,
        message: "message sent to sqs queue",
      });

      const emailerService = new EmailerService();
      const response = await emailerService.sendEmail(currentToken, status);

      expect(response.status).toBe(200);
    });

    it("should throw an error:Error in sendEmail when any error occurs", async () => {
      const currentToken = "token";
      const status = CvUploadStatus.CV_UPLOADED_TO_BAD_BUCKET;
      const emailPayload: EmailPayload = {
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test Body",
      };

      const constructEmailPayloadSpy = jest.spyOn(
        EmailerService.prototype,
        "constructEmailPayload",
      );
      constructEmailPayloadSpy.mockResolvedValue(emailPayload);

      const sendMessageToQueueSpy = jest.spyOn(
        SQSService.prototype,
        "sendMessageToQueue",
      );
      sendMessageToQueueSpy.mockRejectedValue(
        new Error("sendMessageToQueue test"),
      );

      const emailerService = new EmailerService();
      try {
        await emailerService.sendEmail(currentToken, status);
      } catch (error) {
        expect(error).toEqual(new Error("Error in sendEmail"));
      }
    });
  });
});
