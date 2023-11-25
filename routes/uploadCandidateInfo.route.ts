import express, { Request, Response, Router, response } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { saveUserDetailsToDatabase, updateAwsKeyInDatabase } from "../services/saveUserDetailsToDatabase.service";

import { S3UploadService } from "../services/s3-upload.service";

import { findSavedS3key } from "../services/findSavedS3key.service";
import { S3DeleteService } from "../services/s3-delete.service";
import { SQS_Service } from "../services/sqs.service";
import { ConstructEmailPayload } from "../services/constructEmailPaylaod.service";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();

router.post(
	"/",
	upload.single("cv"),
	authMiddleware(["candidate"]),
	validateCandidate,
	checkFileMiddleware,
	async (req: Request, res: Response) => {
		if (!req.file || !req.file.buffer) {
			return res.status(400).json("File or file buffer is missing");
		}

		const currentToken = req.headers.authorization || "";

		let status1;
		let message1;
		let status2;
		let message2;
		let newKey = "";
		let status3;
		let message3;
		let oldKey = "";
		let status4;
		let message4;
		let status5;
		let message5;

		const saveUserDetailsServiceResponse = await saveUserDetailsToDatabase(req.file, req.body, currentToken);

		if (saveUserDetailsServiceResponse.status == 201) {
			status1 = 200;
			message1 = saveUserDetailsServiceResponse.message;
		} else {
			status1 = 500;
			message1 = saveUserDetailsServiceResponse.message;
		}

		const uploadFileResponse = await new S3UploadService().uploadFileToS3(req.file.buffer, req.file.mimetype);

		if (uploadFileResponse.status == 201) {
			status2 = 200;
			message2 = uploadFileResponse.message;
			newKey = uploadFileResponse.Key || "";
			const subject: string = "Your CV has been uploaded";
			const text: string = "Dear Candidate your CV has been uploaded successfully";

			const constructPayloadResponse = await new ConstructEmailPayload().constructEmailPayload(
				currentToken,
				subject,
				text
			);

			if (constructPayloadResponse.status == 200) {
				const emailPayload = constructPayloadResponse.message;

				const sqsResponse = await new SQS_Service().sendMessageToQueue(emailPayload);
				console.log(sqsResponse);
			}
		} else {
			status2 = 500;
			message2 = uploadFileResponse.message;
		}

		const findSavedS3keyResponse = await findSavedS3key(req.headers.authorization || "");
		if (findSavedS3keyResponse.status == 200) {
			status3 = 200;
			message3 = findSavedS3keyResponse.message;
			oldKey = findSavedS3keyResponse.key || "";
		} else {
			status3 = 500;
			message3 = findSavedS3keyResponse.message;
		}

		if (status3 && status2 == 200) {
			const deleteFileResponse = await new S3DeleteService().deleteFileFromS3(oldKey);
			if (deleteFileResponse.status == 201) {
				status4 = 200;
				message4 = deleteFileResponse.message;
			} else {
				status4 = 500;
				message4 = deleteFileResponse.message;
			}
		} else {
			message4 = "no file to delete from s3";
		}

		const updateAwsKeyInDatabaseResponse = await updateAwsKeyInDatabase(
			req.headers.authorization || "",
			newKey
		);

		if (updateAwsKeyInDatabaseResponse.status == 200) {
			status5 = 200;
			message5 = updateAwsKeyInDatabaseResponse.message;
		} else {
			status5 = 500;
			message5 = updateAwsKeyInDatabaseResponse.message;
		}

		if (status1 && status2 && status5) {
			res.status(200).json({
				message1: message1,
				message2: message2,
				message3: message3,
				message4: message4,
				message5: message5,
			});
		} else {
			res.status(500).json({
				message1: message1,
				message2: message2,
				message3: message3,
				message4: message4,
				message5: message5,
			});
		}
	}
);

export default router;
