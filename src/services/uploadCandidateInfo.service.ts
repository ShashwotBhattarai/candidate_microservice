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

		const uploadFileResponse = await uploadFileToS3(reqFile.buffer, reqFile.mimetype, reqFile.originalname);

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

		const sqsResponse = await new SQS_Service().sendMessageToQueue(emailPayload);
		if (sqsResponse.status != 200) {
			return {
				status: sqsResponse.status,
				message: sqsResponse.message,
				data: sqsResponse.data,
			};
		}

		const findSavedS3keyResponse = await findSavedS3key(currentToken);
		if (findSavedS3keyResponse.status == 500) {
			return {
				status: findSavedS3keyResponse.status,
				message: findSavedS3keyResponse.message,
				data: findSavedS3keyResponse.data,
			};
		}

		if (findSavedS3keyResponse.status == 200) {
			const oldKey = findSavedS3keyResponse.data as string;
			const deleteFileResponse = await deleteFileFromS3(oldKey);
			if (deleteFileResponse.status != 200) {
				return {
					status: deleteFileResponse.status,
					message: deleteFileResponse.message,
					data: deleteFileResponse.data,
				};
			}
		}

		const updateAwsKeyInDatabaseResponse = await updateAwsKeyInDatabase(currentToken, newKey);
		if (updateAwsKeyInDatabaseResponse.status != 200) {
			return {
				status: updateAwsKeyInDatabaseResponse.status,
				message: updateAwsKeyInDatabaseResponse.message,
				data: updateAwsKeyInDatabaseResponse.data,
			};
		}

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
