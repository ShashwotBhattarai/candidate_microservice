import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

export async function deleteFileFromS3(key: string) {
	const client = new S3Client({
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
		},
		region: process.env.AWS_REGION || "",
	});

	const command = new DeleteObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: key,
	});

	try {
		const response = await client.send(command);
		return { status: 200, message: "old file deleted from s3", data: response };
	} catch (error) {
		return {
			status: 500,
			message: "s3 delete error",
			data: error,
		};
	}
}
