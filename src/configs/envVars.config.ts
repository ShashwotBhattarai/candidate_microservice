import * as dotenv from "dotenv";
dotenv.config();

export const envVars = {
  DATABASEURI: process.env.DATABASEURI,
  JWTSECRET: process.env.JWTSECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,
  S3_DEFAULT_BUCKET_NAME: process.env.S3_DEFAULT_BUCKET_NAME,
  S3_BAD_BUCKET_NAME: process.env.S3_BAD_BUCKET_NAME,
  PATH: process.env.PATH,
  ACCESS_CONTROL_ALLOW_ORIGIN_URL: process.env.ACCESS_CONTROL_ALLOW_ORIGIN_URL,
  ENV: process.env.ENV,
  PORT: process.env.PORT,
};
