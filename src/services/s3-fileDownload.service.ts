import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
import logger from "../configs/logger.config";
config();

export async function downloadFileFromS3(key: string) {
  try {
    const createS3ClientResponse = await createS3Client();
    const client = createS3ClientResponse.data;
    const imageUrl = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: "resumetrackerbucket",
        Key: key,
      }),
      {
        expiresIn: 60,
      },
    );
    logger.info("Url downloaded");
    return { status: 200, message: "url downloaded", data: imageUrl };
  } catch (err) {
    logger.error("Unknown error in downloading file from s3", err);
    throw new Error("error in downloadFileFromS3");
  }
}
