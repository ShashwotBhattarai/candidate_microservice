import { saveUserDetailsToDatabase } from "./saveUserDetailsToDatabase.service";
import { uploadFileToS3 } from "./s3-upload.service";
import { findSavedS3key } from "./findSavedS3key.service";
import { deleteFileFromS3 } from "./s3-delete.service";
import { updateAwsKeyInDatabase } from "./updateAwsKeyInDatabase.service";
import { constructEmailPayload } from "./constructEmailPayload.service";
import { SQS_Service } from "./sqs.service";
import { createSQSClient } from "./createSQSClient.service";
import { CVUploadedEmailTemplate } from "../constants/email.templets";
import { createS3Client } from "./createS3Client.service";

export default async function uploadCandidateInfoService(currentToken: string, reqFile: any, reqBody: any) {
	if (!reqFile) {
		return { status: 400, message: "File buffer is missing", data: null };
	}
	try {
		const saveUserDetailsServiceResponse = await saveUserDetailsToDatabase(reqFile, reqBody, currentToken);
		if (saveUserDetailsServiceResponse.status != 200) {
			return {
				status: saveUserDetailsServiceResponse.status,
				message: saveUserDetailsServiceResponse.message,
				data: saveUserDetailsServiceResponse.data,
			};
		}

		const s3ClientResponse: any = await createS3Client();
		if (s3ClientResponse.status != 200) {
			return {
				status: s3ClientResponse.status,
				message: s3ClientResponse.message,
				data: s3ClientResponse.data,
			};
		}

		const s3Client = s3ClientResponse.data;
		const uploadFileResponse = await uploadFileToS3(
			reqFile.buffer,
			reqFile.mimetype,
			reqFile.originalname,
			s3Client
		);

		if (uploadFileResponse.status != 200) {
			return { status: uploadFileResponse.status, message: uploadFileResponse.message };
		}
		const newKey = uploadFileResponse.data as string;

		const subject = CVUploadedEmailTemplate.subject;
		const text = CVUploadedEmailTemplate.text;
		const constructEmailPayloadResponse = await constructEmailPayload(currentToken, subject, text);

		if (constructEmailPayloadResponse.status != 200) {
			return {
				status: constructEmailPayloadResponse.status,
				message: constructEmailPayloadResponse.message,
				data: constructEmailPayloadResponse.data,
			};
		}
		const emailPayload = constructEmailPayloadResponse.data;
		const sqsClient = await createSQSClient();
		
		const sqsResponse = await new SQS_Service().sendMessageToQueue(emailPayload, sqsClient);

		const findSavedS3keyResponse = await findSavedS3key(currentToken);
		if (findSavedS3keyResponse.status == 200) {
			const oldKey = findSavedS3keyResponse.data as string;
			const s3Client = await createS3Client();
			const deleteFileResponse = await deleteFileFromS3(oldKey, s3Client);
		}

		const updateAwsKeyInDatabaseResponse = await updateAwsKeyInDatabase(currentToken, newKey);

		return {
			status: 200,
			message: "candidate details upload successfull",
			data: null,
		};
	} catch (error) {
		return {
			status: 500,
			message: "upload candidate service error",
			data: error,
		};
	}
}
