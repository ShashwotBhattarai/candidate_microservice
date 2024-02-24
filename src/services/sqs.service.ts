import { SendMessageCommand } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
import dotenv from "dotenv";
import { createSQSClient } from "./createSQSClient.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";
import logger from "../configs/logger.config";
dotenv.config();

export class SQSService {
  async sendMessageToQueue(emailPayload: EmailPayload) {
    try {
      const createSQSClientResponse = await createSQSClient();
      const client = createSQSClientResponse.data;
      const sqsQueueUrl = process.env.SQS_QUEUE_URL;

      await client.send(
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
