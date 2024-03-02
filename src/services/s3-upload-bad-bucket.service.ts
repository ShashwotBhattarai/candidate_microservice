import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
import { SQSService } from "./sqs.service";
import { FailedCVUploadToBadBucketEmailTemplate } from "../constants/email.templets";
config();

export async function uploadFileToS3BadBucket(
  buffer: Buffer,
  type: string,
  filename: string,
) {
  const currentKey = Date.now() + "_" + filename;

  try {
    const createS3ClientResponse = await createS3Client();
    const client = createS3ClientResponse.data;
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BAD_BUCKET_NAME,
        Key: currentKey,
        Body: buffer,
        ContentType: type,
      }),
    );
    logger.info("New file uploaded to s3 bad bucket");
    return {
      status: 200,
      message: "new file uploaded to s3 bad bucket",
      data: currentKey,
    };
  } catch (error) {
    const emailPayload = {
      to: "shashwot.media@gmail.com",
      subject: FailedCVUploadToBadBucketEmailTemplate.subject,
      text: FailedCVUploadToBadBucketEmailTemplate.text,
    };

    await new SQSService().sendMessageToQueue(emailPayload);

    logger.error("Unknown Error in uploadFileToS3 badbucket", error);
    throw new Error("error in uploadFileToS3 badbucket");
  }
}
