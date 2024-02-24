import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
config();

export async function deleteFileFromS3(key: string) {
  try {
    const createS3ClientResponse = await createS3Client();
    const client = createS3ClientResponse.data;
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }),
    );
    logger.info("File deleted from s3 bucket");
    return { status: 200 };
  } catch (error) {
    logger.error("Unknown Error in deleteFileFromS3", error);
    throw new Error("error in deleteFileFromS3");
  }
}
