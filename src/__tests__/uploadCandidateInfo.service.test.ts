import * as saveUserDetailsToDatabaseModule from "../services/saveUserDetailsToDatabase.service";
import { uploadFileToS3 } from "../services/s3-upload.service";
import { findSavedS3key } from "../services/findSavedS3key.service";
import { deleteFileFromS3 } from "../services/s3-delete.service";
import { updateAwsKeyInDatabase } from "../services/updateAwsKeyInDatabase.service";
import { constructEmailPayload } from "../services/constructEmailPayload.service";
import { SQS_Service } from "../services/sqs.service";
import { createSQSClient } from "../services/createSQSClient.service";
import { CVUploadedEmailTemplate } from "../constants/email.templets";
import { createS3Client } from "../services/createS3Client.service";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";

const mockingoose = require("mockingoose");

describe("uploadCandidateInfo Service", () => {
	test("error in saveUserDetailsToDatabase", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 500,
			message: "error in database in saveUserDetailsToDatabase",
			data: { error: "error sd" },
		});

		const mockFile = {
			fieldname: "cv",
			originalname: "SLC.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: "buffermock",
			size: 473672,
		};

		const bodyMock = {
			fullname: "my name bahubali surya",
			email: "acstockthankot@gmail.com",
			phone_number: "+9779800000002",
		};

		const accessTokenMock =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";

		const finalResult = await uploadCandidateInfoService(accessTokenMock, mockFile, bodyMock);

		expect(finalResult.status).toBe(500);
		expect(finalResult.message).toBe("error in database in saveUserDetailsToDatabase");
	});


	test("error in saveUserDetailsToDatabase", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 500,
			message: "error in database in saveUserDetailsToDatabase",
			data: { error: "error sd" },
		});

		const mockFile = {
			fieldname: "cv",
			originalname: "SLC.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: "buffermock",
			size: 473672,
		};

		const bodyMock = {
			fullname: "my name bahubali surya",
			email: "acstockthankot@gmail.com",
			phone_number: "+9779800000002",
		};

		const accessTokenMock =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";

		const finalResult = await uploadCandidateInfoService(accessTokenMock, mockFile, bodyMock);

		expect(finalResult.status).toBe(500);
		expect(finalResult.message).toBe("error in database in saveUserDetailsToDatabase");
	});
});
