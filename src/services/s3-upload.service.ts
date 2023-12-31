import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
config();

export async function uploadFileToS3(buffer: Buffer, type: string, filename: string) {
	const currentKey = Date.now() + "_" + filename;

	try {
		const createS3ClientResponse = await createS3Client();
		const client = createS3ClientResponse.data as S3Client;
		const response = await client.send(
			new PutObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: currentKey,
				Body: buffer,
				ContentType: type,
			})
		);
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
