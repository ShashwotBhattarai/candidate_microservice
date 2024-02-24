import { CandidateInfo } from "../models/cadidateInfo.model";
import { findCurrentuserId } from "./findCurrentUserId.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";
import logger from "../configs/logger.config";

export async function constructEmailPayload(
  currentUserToken: string,
  subject: string,
  text: string,
) {
  const user_id = await findCurrentuserId(currentUserToken);

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
