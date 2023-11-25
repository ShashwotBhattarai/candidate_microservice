import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import generateUniqueId from "generate-unique-id";
import { SQS_Service } from "./sqs.service";
config();

export class S3UploadService {
	async uploadFileToS3(buffer: Buffer, type: string) {
		const client = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			},
			region: process.env.AWS_REGION || "",
		});

		const currentKey = generateUniqueId();
		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: currentKey,
			Body: buffer,
			ContentType: type,
		});

		try {
			const response = await client.send(command);
			return {
				status: 201,
				message: "new file uploaded to s3 bucket",
				Key: currentKey,
			};
		} catch (err) {
			return {
				status: 500,
				message: err,
			};
		}
	}
}
