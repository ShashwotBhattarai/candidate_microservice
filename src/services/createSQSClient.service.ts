import { SQSClient } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import logger from "../configs/logger.config";
dotenv.config();

export async function createSQSClient() {
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  ) {
    const client = new SQSClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    logger.info("SQS Client created");
    return {
      status: 200,
      message: "SQSClient created",
      data: client,
    };
  } else {
    logger.error("Unknown error in creating SQS client");
    throw new Error("error creating SQS client");
  }
}
