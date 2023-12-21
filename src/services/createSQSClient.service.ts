import { SQSClient } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();

export async function createSQSClient() {
	const client = new SQSClient({
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
		},
		region: process.env.AWS_REGION || "",
	});

	return client;
}
