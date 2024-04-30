import { S3Client } from "@aws-sdk/client-s3";
import { envVars } from "../configs/envVars.config";

const s3Client: S3Client = new S3Client({
  credentials: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY as string,
  },
  region: envVars.AWS_REGION,
});

export default s3Client;
