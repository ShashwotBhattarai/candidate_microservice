import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
import dotenv from "dotenv";
dotenv.config();

export class SQS_Service {
	async sendMessageToQueue(emailPayload: any, client: any) {
		try {
			const sqsQueueUrl = process.env.SQS_QUEUE_URL;

			const response = await client.send(
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
			return { status: 200, message: "message sent to queue", data: null };
		} catch (error) {
			return { status: 500, message: "error in sendMessageToQueue", data: error };
		}
	}
}
