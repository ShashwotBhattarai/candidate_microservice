import { SQSClient } from "@aws-sdk/client-sqs";
import { envVars } from "../configs/envVars.config";

const sqsClient: SQSClient = new SQSClient({
  credentials: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY as string,
  },
  region: envVars.AWS_REGION,
});

export default sqsClient;
