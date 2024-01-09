import { saveUserDetailsToDatabase } from "./saveUserDetailsToDatabase.service";
import { uploadFileToS3 } from "./s3-upload.service";
import { findSavedS3key } from "./findSavedS3key.service";
import { deleteFileFromS3 } from "./s3-delete.service";
import { updateAwsKeyInDatabase } from "./updateAwsKeyInDatabase.service";
import { constructEmailPayload } from "./constructEmailPayload.service";
import { SQS_Service } from "./sqs.service";
import { CVUploadedEmailTemplate } from "../constants/email.templets";

export default async function uploadCandidateInfoService(currentToken: string, reqFile: any, reqBody: any) {
	if (!reqFile) {
		return { status: 400, message: "File buffer is missing", data: null };
	}
	try {
		await saveUserDetailsToDatabase(reqFile, reqBody, currentToken);

		const uploadFileResponse = await uploadFileToS3(reqFile.buffer, reqFile.mimetype, reqFile.originalname);

		const newKey = uploadFileResponse.data as string;

		const subject = CVUploadedEmailTemplate.subject;
		const text = CVUploadedEmailTemplate.text;
		const emailPayload = await constructEmailPayload(currentToken, subject, text);

		await new SQS_Service().sendMessageToQueue(emailPayload);

		const findSavedS3keyResponse = await findSavedS3key(currentToken);

		if (findSavedS3keyResponse.status == 200) {
			const oldKey = findSavedS3keyResponse.data as string;
			await deleteFileFromS3(oldKey);
		}

		await updateAwsKeyInDatabase(currentToken, newKey);

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
