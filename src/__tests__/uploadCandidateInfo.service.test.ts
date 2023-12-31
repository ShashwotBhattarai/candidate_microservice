import * as saveUserDetailsToDatabaseModule from "../services/saveUserDetailsToDatabase.service";
import * as findSavedS3keyModule from "../services/findSavedS3key.service";
import * as deleteFileFromS3Module from "../services/s3-delete.service";
import * as updateAwsKeyInDatabaseModule from "../services/updateAwsKeyInDatabase.service";
import { SQS_Service } from "../services/sqs.service";
import * as createS3clientModule from "../services/createS3Client.service";
import * as uploadFileToS3Module from "../services/s3-upload.service";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";
import * as constructEmailPayloadModule from "../services/constructEmailPayload.service";
import * as createSqsClientModule from "../services/createSQSClient.service";
import { S3Client } from "@aws-sdk/client-s3";
import { SQS, SQSClient } from "@aws-sdk/client-sqs";

const mockingoose = require("mockingoose");

describe("uploadCandidateInfo Service", () => {
	test("error if file is missing", async () => {
		const mockFile = null;

		const bodyMock = {
			fullname: "my name bahubali surya",
			email: "acstockthankot@gmail.com",
			phone_number: "+9779800000002",
		};

		const accessTokenMock =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";

		const finalResult = await uploadCandidateInfoService(accessTokenMock, mockFile, bodyMock);

		expect(finalResult.status).toBe(400);
		expect(finalResult.message).toBe("File buffer is missing");
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
	test("error in uploadFileToS3", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});
		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 500,
			message: "s3 upload error",
			data: { error: "s3client error" },
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
		expect(finalResult.message).toBe("s3 upload error");
	});

	test("error in constructEmailPayload", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});
		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 500,
			message: "error in constructEmailPayload",
			data: { error: "error in constructEmailPayload" },
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
		expect(finalResult.message).toBe("error in constructEmailPayload");
	});
	test("error in sendMessageToQueue", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});
		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 500,
			message: "error in sendMessageToQueue mock",
			data: { error: "error in sendMessageToQueue" },
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
		expect(finalResult.message).toBe("error in sendMessageToQueue mock");
	});

	test("error in findsavedkey", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});

		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
		findsavedkeyModuleSpy.mockResolvedValue({
			status: 500,
			message: "error in findsaveds3key mock",
			data: { error: "error in findsaveds3key" },
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
		expect(finalResult.message).toBe("error in findsaveds3key mock");
	});

	test("if saved s3 key is found but error in deleteFileFromS3", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});

		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
		findsavedkeyModuleSpy.mockResolvedValue({
			status: 200,
			message: "old file key found",
			data: "oldkey",
		});

		const deleteFileFromS3ModuleSpy = jest.spyOn(deleteFileFromS3Module, "deleteFileFromS3");
		deleteFileFromS3ModuleSpy.mockResolvedValue({
			status: 500,
			message: "s3 delete error mock",
			data: { error: "s3 delete error" },
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
		expect(finalResult.message).toBe("s3 delete error mock");
	});
	test("error in update aws key in database ", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});

		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
		findsavedkeyModuleSpy.mockResolvedValue({
			status: 200,
			message: "old file key found",
			data: "oldkey",
		});

		const deleteFileFromS3ModuleSpy = jest.spyOn(deleteFileFromS3Module, "deleteFileFromS3");
		deleteFileFromS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "file deleted from s3",
			data: "file deleted from s3",
		});

		const updateAwsKeyInDatabaseModuleSpy = jest.spyOn(updateAwsKeyInDatabaseModule, "updateAwsKeyInDatabase");
		updateAwsKeyInDatabaseModuleSpy.mockResolvedValue({
			status: 500,
			message: "error in update aws key in database mock",
			data: { error: "error in update aws key in database" },
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
		expect(finalResult.message).toBe("error in update aws key in database mock");
	});
	test("everything works fine if the user is not uploading info for the first time ", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});

		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
		findsavedkeyModuleSpy.mockResolvedValue({
			status: 200,
			message: "old file key found",
			data: "oldkey",
		});

		const deleteFileFromS3ModuleSpy = jest.spyOn(deleteFileFromS3Module, "deleteFileFromS3");
		deleteFileFromS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "file deleted from s3",
			data: "file deleted from s3",
		});

		const updateAwsKeyInDatabaseModuleSpy = jest.spyOn(updateAwsKeyInDatabaseModule, "updateAwsKeyInDatabase");
		updateAwsKeyInDatabaseModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
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

		expect(finalResult.status).toBe(200);
		expect(finalResult.message).toBe("candidate details upload successfull");
	});
	test("everything works fine if the user is uploading info for the first time ", async () => {
		const saveUserDetailsToDatabaseSpy = jest.spyOn(
			saveUserDetailsToDatabaseModule,
			"saveUserDetailsToDatabase"
		);

		// Changed mock implementation to match expected return type
		saveUserDetailsToDatabaseSpy.mockResolvedValue({
			status: 200,
			message: "User info Saved to database",
			data: { id: 123 },
		});

		const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
		createS3clientModuleSpy.mockResolvedValue({
			status: 200,
			message: "s3 client created",
			data: new S3Client(),
		});

		const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
		uploadFileToS3ModuleSpy.mockResolvedValue({
			status: 200,
			message: "new file uploaded to s3 bucket",
			data: "currentkey",
		});

		const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
		constructEmailPayloadModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
		createSqsClientModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: new SQSClient(),
		});

		const sendMessageToQueueSpy = jest.spyOn(SQS_Service.prototype, "sendMessageToQueue");
		sendMessageToQueueSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
		});

		const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
		findsavedkeyModuleSpy.mockResolvedValue({
			status: 204,
			message: "old file key not found",
			data: null,
		});

		const updateAwsKeyInDatabaseModuleSpy = jest.spyOn(updateAwsKeyInDatabaseModule, "updateAwsKeyInDatabase");
		updateAwsKeyInDatabaseModuleSpy.mockResolvedValue({
			status: 200,
			message: "ok",
			data: { ok: "ok" },
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

		expect(finalResult.status).toBe(200);
		expect(finalResult.message).toBe("candidate details upload successfull");
	});
});
