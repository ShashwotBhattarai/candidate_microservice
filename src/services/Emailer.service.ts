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

export class EmailerService {
  public async constructEmailPayload(
    currentUserToken: string,
    subject: string,
    text: string,
  ): Promise<EmailPayload> {
    const user_id = new UtilsService().findCurrentuserId(currentUserToken);

    let namedSubject;

    try {
      const response = await CandidateInfo.findOne({ user_id: user_id });

      if (response instanceof CandidateInfo) {
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
        throw new Error(`error in constructemailpayload`);
      }
    } catch (error) {
      logger.error("Unknown error in constructemailpayload", error);
      throw new Error(`error in constructemailpayload`);
    }
  }

  public async sendEmail(currentToken: string, status: string) {
    let subject: string = "";
    let text: string = "";

    if (status === CvUploadStatus.CvUploadSuccessful) {
      subject = CVUploadSuccessFullEmailTemplate.subject;
      text = CVUploadSuccessFullEmailTemplate.text;
    } else if (status === CvUploadStatus.CvUploadedToBadBucket) {
      subject = CVUploadBadBucketEmailTemplate.subject;
      text = CVUploadBadBucketEmailTemplate.text;
    }

    const emailPayload = await this.constructEmailPayload(
      currentToken,
      subject,
      text,
    );
    await new SQSService().sendMessageToQueue(emailPayload);
  }
}