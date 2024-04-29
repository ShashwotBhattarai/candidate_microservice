import { EmailPayload } from "../models/emailPayload.type";
import logger from "../configs/logger.config";
import {
  CVUploadBadBucketEmailTemplate,
  CVUploadSuccessFullEmailTemplate,
} from "../constants/email.templets";
import { SQSService } from "./sqs.service";
import { CandidateInfo } from "../entities/candidateInfo.entity";
import { CvUploadStatus } from "../constants/cvUploadStatus.enum";
import { UtilsService } from "./utils.service";
import { ServiceResponse } from "../models/serviceResponse.type";

export class EmailerService {
  public async constructEmailPayload(
    currentUserToken: string,
    subject: string,
    text: string,
  ): Promise<EmailPayload> {
    try {
      const user_id = new UtilsService().findCurrentuserId(currentUserToken);

      let namedSubject;
      const response = await CandidateInfo.findOne({ user_id: user_id });

      if (response) {
        const email = response.email;
        const fullname = response.fullname;

        namedSubject = "Hi " + fullname + " " + subject;

        const emailPayload: EmailPayload = {
          to: email,
          subject: namedSubject,
          text: text,
        };
        logger.info("Email payload created successfully");
        return emailPayload;
      } else {
        throw new Error(`error in constructEmailPayload`);
      }
    } catch (error) {
      logger.error("Unknown error in constructEmailPayload", error);
      throw new Error(`error in constructEmailPayload`);
    }
  }

  public async sendEmail(
    currentToken: string,
    status: string,
  ): Promise<ServiceResponse> {
    let subject: string = "";
    let text: string = "";

    switch (status) {
      case CvUploadStatus.CV_UPLOAD_SUCCESSFUL:
        subject = CVUploadSuccessFullEmailTemplate.subject;
        text = CVUploadSuccessFullEmailTemplate.text;
        break;
      case CvUploadStatus.CV_UPLOADED_TO_BAD_BUCKET:
        subject = CVUploadBadBucketEmailTemplate.subject;
        text = CVUploadBadBucketEmailTemplate.text;
        break;
    }
    try {
      const emailPayload = await this.constructEmailPayload(
        currentToken,
        subject,
        text,
      );
      const response = await new SQSService().sendMessageToQueue(emailPayload);
      logger.info("message sent to queue", response);
      return {
        status: 200,
        message: "message sent to queue",
      };
    } catch (error) {
      throw new Error("Error in sendEmail");
    }
  }
}
