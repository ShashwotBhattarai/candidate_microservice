import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
config();

export async function generateS3UploadURL(key: string) {
  try {
    const createS3ClientResponse = await createS3Client();
    const client = createS3ClientResponse.data;
    const imageUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: "resumetrackerbucket",
        Key: key,
      }),
      {
        expiresIn: 60,
      },
    );
    logger.info("Upload Url created");
    return { status: 200, message: "upload url created", data: imageUrl };
  } catch (err) {
    logger.error("Unknown error in creating upload url from s3", err);
    throw new Error("error in generateS3UploadURL");
  }
}
