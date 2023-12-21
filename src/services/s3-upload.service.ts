import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

export async function uploadFileToS3(buffer: Buffer, type: string, filename: string) {
	const client = new S3Client({
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
		},
		region: process.env.AWS_REGION || "",
	});

	const currentKey = Date.now() + "_" + filename;
	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: currentKey,
		Body: buffer,
		ContentType: type,
	});

	try {
		const response = await client.send(command);
		return {
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: currentKey,
		};
	} catch (error) {
		return {
			status: 500,
			message: "s3 upload error",
			data: error,
		};
	}
}
