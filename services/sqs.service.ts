import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
export class SQS_Service {
	async sendMessageToQueue(emailPayload: any) {
		const client = new SQSClient({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			},
			region: process.env.AWS_REGION || "",
		});
		const sqsQueueUrl = process.env.SQS_QUEUE_URL;

		const command = new SendMessageCommand({
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
		});

		const response = await client.send(command);
		// console.log(response);
		return response;
	}
}
