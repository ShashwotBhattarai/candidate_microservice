"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const saveUserDetailsToDatabaseModule = __importStar(require("../services/saveUserDetailsToDatabase.service"));
const findSavedS3keyModule = __importStar(require("../services/findSavedS3key.service"));
const deleteFileFromS3Module = __importStar(require("../services/s3-delete.service"));
const updateAwsKeyInDatabaseModule = __importStar(require("../services/updateAwsKeyInDatabase.service"));
const sqs_service_1 = require("../services/sqs.service");
const createS3clientModule = __importStar(require("../services/createS3Client.service"));
const uploadFileToS3Module = __importStar(require("../services/s3-upload.service"));
const uploadCandidateInfo_service_1 = __importDefault(require("../services/uploadCandidateInfo.service"));
const constructEmailPayloadModule = __importStar(require("../services/constructEmailPayload.service"));
const createSqsClientModule = __importStar(require("../services/createSQSClient.service"));
const client_s3_1 = require("@aws-sdk/client-s3");
const client_sqs_1 = require("@aws-sdk/client-sqs");
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
const accessTokenMock = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
const saveUserDetailsToDatabaseSpy = jest.spyOn(saveUserDetailsToDatabaseModule, "saveUserDetailsToDatabase");
// Changed mock implementation to match expected return type
saveUserDetailsToDatabaseSpy.mockResolvedValue({
    status: 200,
});
const createS3clientModuleSpy = jest.spyOn(createS3clientModule, "createS3Client");
createS3clientModuleSpy.mockResolvedValue({
    status: 200,
    message: "s3 client created",
    data: new client_s3_1.S3Client(),
});
const uploadFileToS3ModuleSpy = jest.spyOn(uploadFileToS3Module, "uploadFileToS3");
uploadFileToS3ModuleSpy.mockResolvedValue({
    status: 200,
    message: "new file uploaded to s3 bucket",
    data: "currentkey",
});
const constructEmailPayloadModuleSpy = jest.spyOn(constructEmailPayloadModule, "constructEmailPayload");
constructEmailPayloadModuleSpy.mockResolvedValue({
    to: "abcd@getMaxListeners.com",
    subject: "hello",
    text: "hello world",
});
const createSqsClientModuleSpy = jest.spyOn(createSqsClientModule, "createSQSClient");
createSqsClientModuleSpy.mockResolvedValue({
    status: 200,
    message: "ok",
    data: new client_sqs_1.SQSClient(),
});
const sendMessageToQueueSpy = jest.spyOn(sqs_service_1.SQSService.prototype, "sendMessageToQueue");
sendMessageToQueueSpy.mockResolvedValue({
    status: 200,
});
const updateAwsKeyInDatabaseModuleSpy = jest.spyOn(updateAwsKeyInDatabaseModule, "updateAwsKeyInDatabase");
updateAwsKeyInDatabaseModuleSpy.mockResolvedValue({
    status: 200,
});
describe("uploadCandidateInfo Service", () => {
    test("error if file is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const finalResult = yield (0, uploadCandidateInfo_service_1.default)(accessTokenMock, mockNullFile, bodyMock);
        expect(finalResult.status).toBe(400);
        expect(finalResult.message).toBe("File buffer is missing");
    }));
    test("everything works fine if the user is not uploading info for the first time ", () => __awaiter(void 0, void 0, void 0, function* () {
        const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
        findsavedkeyModuleSpy.mockResolvedValue({
            status: 200,
            message: "old file key found",
            data: "oldkey",
        });
        const deleteFileFromS3ModuleSpy = jest.spyOn(deleteFileFromS3Module, "deleteFileFromS3");
        deleteFileFromS3ModuleSpy.mockResolvedValue({
            status: 200,
        });
        const finalResult = yield (0, uploadCandidateInfo_service_1.default)(accessTokenMock, mockFile, bodyMock);
        expect(finalResult.status).toBe(200);
        expect(finalResult.message).toBe("candidate details upload successfull");
    }));
    test("everything works fine if the user is uploading info for the first time ", () => __awaiter(void 0, void 0, void 0, function* () {
        const findsavedkeyModuleSpy = jest.spyOn(findSavedS3keyModule, "findSavedS3key");
        findsavedkeyModuleSpy.mockResolvedValue({
            status: 204,
            message: "old file key not found",
            data: null,
        });
        const finalResult = yield (0, uploadCandidateInfo_service_1.default)(accessTokenMock, mockFile, bodyMock);
        expect(finalResult.status).toBe(200);
        expect(finalResult.message).toBe("candidate details upload successfull");
    }));
});
