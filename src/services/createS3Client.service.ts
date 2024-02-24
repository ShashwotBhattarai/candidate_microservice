import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import logger from "../configs/logger.config";
dotenv.config();

export async function createS3Client() {
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  ) {
    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    logger.info("S3 Client created");
    return {
      status: 200,
      message: "S3 Client created",
      data: client,
    };
  } else {
    logger.error("Unknown error in creating S3 client");
    throw new Error("error creating S3 client");
  }
}
