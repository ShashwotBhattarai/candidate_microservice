import { SQS } from "aws-sdk";
import * as dotenv from "dotenv";

const sqsConfig: SQS.Types.ClientConfiguration = {
  apiVersion: "2012-11-05",
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export const sqs = new SQS(sqsConfig);
