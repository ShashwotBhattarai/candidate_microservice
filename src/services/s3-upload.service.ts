import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
import { uploadFileToS3BadBucket } from "./s3-upload-bad-bucket.service";
import { FailedCVUploadedEmailTemplate } from "../constants/email.templets";
import { constructEmailPayload } from "./constructEmailPayload.service";
import { SQSService } from "./sqs.service";
config();

export async function uploadFileToS3(
  buffer: Buffer,
  type: string,
  filename: string,
  currentToken: string,
) {
  const currentKey = Date.now() + "_" + filename;

  try {
    const createS3ClientResponse = await createS3Client();
    const client = createS3ClientResponse.data;
    const response = await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: currentKey,
        Body: buffer,
        ContentType: type,
      }),
    );

    if (response.$metadata.httpStatusCode == 200) {
      logger.info("New file uploaded to s3 bucket");
      return {
        status: 200,
        message: "new file uploaded to s3 bucket",
        data: currentKey,
      };
    } else {
      const subject = FailedCVUploadedEmailTemplate.subject;
      const text = FailedCVUploadedEmailTemplate.text;
      const emailPayload = await constructEmailPayload(
        currentToken,
        subject,
        text,
      );
      await new SQSService().sendMessageToQueue(emailPayload);
      await uploadFileToS3BadBucket(buffer, type, filename);
      throw new Error("error in uploadFileToS3");
    }
  } catch (error) {
    logger.error("Unknown Error in uploadFileToS3", error);
    throw new Error("error in uploadFileToS3");
  }
}
