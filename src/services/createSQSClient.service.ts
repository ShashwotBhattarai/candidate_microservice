import { SQSClient } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();

export async function createSQSClient() {
	if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
		const client = new SQSClient({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},
			region: process.env.AWS_REGION,
		});

		return {
			status: 200,
			message: "SQSClient created",
			data: client,
		};
	} else {
		throw {
			status: 500,
			message: "error in createSQSClient",
			data: null,
		};
	}
}
