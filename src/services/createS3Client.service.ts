import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export async function createS3Client() {
	try {
		const client = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			},
			region: process.env.AWS_REGION || "",
		});

		return {
			status: 200,
			message: "S3 Client created",
			data: client,
		};
	} catch (error) {
		return {
			status: 500,
			message: "error in createS3Client service",
			data: error,
		};
	}
}
