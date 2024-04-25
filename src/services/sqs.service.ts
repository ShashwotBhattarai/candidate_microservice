import { SendMessageCommand } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
import { EmailPayload } from "../types/emailPayload.type";
import logger from "../configs/logger.config";
import sqsClient from "../configs/sqsClient.config";
import { envVars } from "../configs/envVars.config";

export class SQSService {
  async sendMessageToQueue(emailPayload: EmailPayload) {
    try {
      const sqsQueueUrl = envVars.SQS_QUEUE_URL;

      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageAttributes: {
            To: {
              DataType: "String",
              StringValue: emailPayload.to,
            },
            Subject: {
              DataType: "String",
              StringValue: emailPayload.subject,
            },
          },
          MessageBody: emailPayload.text,
          MessageGroupId: "sendEmailResumeTracker",
          MessageDeduplicationId: generateUniqueId(),
        }),
      );
      logger.info("Message sent to Emailer SQS Queue");
      return { status: 200 };
    } catch (error) {
      logger.error("Unknown Error in sendMessageToQueue", error);
      throw new Error(`error in sendMessageToQueue`);
    }
  }
}
