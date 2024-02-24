import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
config();

export async function uploadFileToS3(
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
        Bucket: process.env.S3_BUCKET_NAME,
        Key: currentKey,
        Body: buffer,
        ContentType: type,
      }),
    );
    logger.info("New file uploaded to s3 bucket");
    return {
      status: 200,
      message: "new file uploaded to s3 bucket",
      data: currentKey,
    };
  } catch (error) {
    logger.error("Unknown Error in uploadFileToS3", error);
    throw new Error("error in uploadFileToS3");
  }
}
