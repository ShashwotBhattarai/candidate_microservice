import { saveUserDetailsToDatabase } from "./saveUserDetailsToDatabase.service";
import { uploadFileToS3 } from "./s3-upload.service";
import { findSavedS3key } from "./findSavedS3key.service";
import { deleteFileFromS3 } from "./s3-delete.service";
import { updateAwsKeyInDatabase } from "./updateAwsKeyInDatabase.service";
import { constructEmailPayload } from "./constructEmailPayload.service";
import { SQSService } from "./sqs.service";
import { CVUploadedEmailTemplate } from "../constants/email.templets";
import logger from "../configs/logger.config";

export async function uploadCandidateInfoService(
  currentToken: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reqFile: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reqBody: any,
) {
  if (!reqFile) {
    logger.info("File buffer is missing");
    return { status: 400, message: "File buffer is missing", data: null };
  }
  try {
    await saveUserDetailsToDatabase(reqFile, reqBody, currentToken);

    const uploadFileResponse = await uploadFileToS3(
      reqFile.buffer,
      reqFile.mimetype,
      reqFile.originalname,
    );

    const newKey = uploadFileResponse.data;

    const subject = CVUploadedEmailTemplate.subject;
    const text = CVUploadedEmailTemplate.text;
    const emailPayload = await constructEmailPayload(
      currentToken,
      subject,
      text,
    );

    await new SQSService().sendMessageToQueue(emailPayload);

    const findSavedS3keyResponse = await findSavedS3key(currentToken);

    if (findSavedS3keyResponse.status == 200) {
      const oldKey = findSavedS3keyResponse.data as string;
      await deleteFileFromS3(oldKey);
    }

    await updateAwsKeyInDatabase(currentToken, newKey);
    logger.info("Candidate details upload successfull");
    return {
      status: 200,
      message: "candidate details upload successfull",
    };
  } catch (error) {
    logger.error("Unknown error in uploadCandidateInfoService", error);
    throw new Error("error in uploadCandidateInfoService ");
  }
}
