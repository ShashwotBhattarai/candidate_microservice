import { Request } from "express";
import { saveUserDetailsToDatabase } from "./saveUserDetailsToDatabase.service";
import { uploadFileToS3 } from "./s3-upload.service";
import { findSavedS3key } from "./findSavedS3key.service";
import { deleteFileFromS3 } from "./s3-delete.service";
import { updateAwsKeyInDatabase } from "./updateAwsKeyInDatabase.service";
import { constructEmailPayload } from "./constructEmailPayload.service";
import { SQS_Service } from "./sqs.service";
import { createSQSClient } from "./createSQSClient.service";
import { CVUploadedEmailTemplate } from "../constants/email.templets";

export default async function uploadCandidateInfoService(req: Request) {
	const currentToken = req.headers.authorization || "";

	try {
		const saveUserDetailsServiceResponse = await saveUserDetailsToDatabase(req.file, req.body, currentToken);
		if (saveUserDetailsServiceResponse.status != 200) {
			return {
				status: saveUserDetailsServiceResponse.status,
				message: saveUserDetailsServiceResponse.message,
				data: saveUserDetailsServiceResponse.data,
			};
		}

		if (!req.file) {
			return { status: 400, message: "File buffer is missing", data: null };
		}
		const uploadFileResponse = await uploadFileToS3(req.file.buffer, req.file.mimetype, req.file.originalname);

		if (uploadFileResponse.status != 200) {
			return { status: uploadFileResponse.status, message: uploadFileResponse.message };
		}
		const newKey = uploadFileResponse.data as string;

		const subject = CVUploadedEmailTemplate.subject;
		const text = CVUploadedEmailTemplate.text;
		const constructEmailPayloadResponse = await constructEmailPayload(currentToken, subject, text);
		const emailPayload = constructEmailPayloadResponse.data;
		const sqsClient = await createSQSClient();
		const sqsResponse = await new SQS_Service().sendMessageToQueue(emailPayload, sqsClient);

		const findSavedS3keyResponse = await findSavedS3key(currentToken);
		if (findSavedS3keyResponse.status == 200) {
			const oldKey = findSavedS3keyResponse.data as string;
			const deleteFileResponse = await deleteFileFromS3(oldKey);
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
