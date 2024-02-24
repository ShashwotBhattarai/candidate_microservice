import * as saveUserDetailsToDatabaseModule from "../services/saveUserDetailsToDatabase.service";
import * as findSavedS3keyModule from "../services/findSavedS3key.service";
import * as deleteFileFromS3Module from "../services/s3-delete.service";
import * as updateAwsKeyInDatabaseModule from "../services/updateAwsKeyInDatabase.service";
import { SQSService } from "../services/sqs.service";
import * as createS3clientModule from "../services/createS3Client.service";
import * as uploadFileToS3Module from "../services/s3-upload.service";
import { uploadCandidateInfoService } from "../services/uploadCandidateInfo.service";
import * as constructEmailPayloadModule from "../services/constructEmailPayload.service";
import * as createSqsClientModule from "../services/createSQSClient.service";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

const mockNullFile = null;
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

const saveUserDetailsToDatabaseSpy = jest.spyOn(
  saveUserDetailsToDatabaseModule,
  "saveUserDetailsToDatabase",
);

// Changed mock implementation to match expected return type
saveUserDetailsToDatabaseSpy.mockResolvedValue({
  status: 200,
});

const createS3clientModuleSpy = jest.spyOn(
  createS3clientModule,
  "createS3Client",
);
createS3clientModuleSpy.mockResolvedValue({
  status: 200,
  message: "s3 client created",
  data: new S3Client(),
});

const uploadFileToS3ModuleSpy = jest.spyOn(
  uploadFileToS3Module,
  "uploadFileToS3",
);
uploadFileToS3ModuleSpy.mockResolvedValue({
  status: 200,
  message: "new file uploaded to s3 bucket",
  data: "currentkey",
});

const constructEmailPayloadModuleSpy = jest.spyOn(
  constructEmailPayloadModule,
  "constructEmailPayload",
);
constructEmailPayloadModuleSpy.mockResolvedValue({
  to: "abcd@getMaxListeners.com",
  subject: "hello",
  text: "hello world",
});

const createSqsClientModuleSpy = jest.spyOn(
  createSqsClientModule,
  "createSQSClient",
);
createSqsClientModuleSpy.mockResolvedValue({
  status: 200,
  message: "ok",
  data: new SQSClient(),
});

const sendMessageToQueueSpy = jest.spyOn(
  SQSService.prototype,
  "sendMessageToQueue",
);
sendMessageToQueueSpy.mockResolvedValue({
  status: 200,
});
const updateAwsKeyInDatabaseModuleSpy = jest.spyOn(
  updateAwsKeyInDatabaseModule,
  "updateAwsKeyInDatabase",
);
updateAwsKeyInDatabaseModuleSpy.mockResolvedValue({
  status: 200,
});
describe("uploadCandidateInfo Service", () => {
  test("error if file is missing", async () => {
    const finalResult = await uploadCandidateInfoService(
      accessTokenMock,
      mockNullFile,
      bodyMock,
    );

    expect(finalResult.status).toBe(400);
    expect(finalResult.message).toBe("File buffer is missing");
  });

  test("everything works fine if the user is not uploading info for the first time ", async () => {
    const findsavedkeyModuleSpy = jest.spyOn(
      findSavedS3keyModule,
      "findSavedS3key",
    );
    findsavedkeyModuleSpy.mockResolvedValue({
      status: 200,
      message: "old file key found",
      data: "oldkey",
    });

    const deleteFileFromS3ModuleSpy = jest.spyOn(
      deleteFileFromS3Module,
      "deleteFileFromS3",
    );
    deleteFileFromS3ModuleSpy.mockResolvedValue({
      status: 200,
    });

    const finalResult = await uploadCandidateInfoService(
      accessTokenMock,
      mockFile,
      bodyMock,
    );

    expect(finalResult.status).toBe(200);
    expect(finalResult.message).toBe("candidate details upload successfull");
  });
  test("everything works fine if the user is uploading info for the first time ", async () => {
    const findsavedkeyModuleSpy = jest.spyOn(
      findSavedS3keyModule,
      "findSavedS3key",
    );
    findsavedkeyModuleSpy.mockResolvedValue({
      status: 204,
      message: "old file key not found",
      data: null,
    });

    const finalResult = await uploadCandidateInfoService(
      accessTokenMock,
      mockFile,
      bodyMock,
    );

    expect(finalResult.status).toBe(200);
    expect(finalResult.message).toBe("candidate details upload successfull");
  });
});
