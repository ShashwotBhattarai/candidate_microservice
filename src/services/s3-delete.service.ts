import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createS3Client } from "./createS3Client.service";
config();

export async function deleteFileFromS3(key: string) {
	try {
		const createS3ClientResponse = await createS3Client();
		const client = createS3ClientResponse.data;
		await client.send(
			new DeleteObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: key,
			})
		);
		return { status: 200 };
	} catch (error) {
		throw new Error("error in deleteFileFromS3");
	}
}
