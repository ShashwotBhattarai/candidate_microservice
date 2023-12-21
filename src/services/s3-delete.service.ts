import { DeleteObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

export async function deleteFileFromS3(key: string, client: any) {
	try {
		const response = await client.send(
			new DeleteObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: key,
			})
		);
		return { status: 200, message: "old file deleted from s3", data: response };
	} catch (error) {
		return {
			status: 500,
			message: "s3 delete error",
			data: error,
		};
	}
}
