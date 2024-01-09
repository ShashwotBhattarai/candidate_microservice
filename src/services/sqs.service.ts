import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
import dotenv from "dotenv";
import { createSQSClient } from "./createSQSClient.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";
dotenv.config();

export class SQS_Service {
	async sendMessageToQueue(emailPayload: EmailPayload) {
		try {
			const createSQSClientResponse = await createSQSClient();
			const client = createSQSClientResponse.data as SQSClient;
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
				})
			);

			return { status: 200 };
		} catch (error) {
			throw new Error(`error in sendMessageToQueue`);
		}
	}
}
