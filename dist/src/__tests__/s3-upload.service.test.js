"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_sdk_client_mock_1 = require("aws-sdk-client-mock");
const s3_upload_service_1 = require("../services/s3-upload.service");
describe("Sqs service", () => {
    const s3ClientMock = (0, aws_sdk_client_mock_1.mockClient)(client_s3_1.S3Client);
    beforeEach(() => {
        jest.clearAllMocks();
        s3ClientMock.reset();
    });
    test("file gets uploaded to s3", () => __awaiter(void 0, void 0, void 0, function* () {
        //mock all dependencies
        const generateUniqueId = jest.fn().mockReturnValue("mocked-unique-id");
        s3ClientMock.on(client_s3_1.PutObjectCommand).resolves({
            $metadata: {
                httpStatusCode: 200,
                requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
        });
        const hexString = "255044462d312e370d0a25b5b5b5b50d0a312030206f626a0d0a3c3c2f547970652f436174616c6f672f5061676573203220";
        const mockBuffer = Buffer.from(hexString, "hex");
        const result = yield (0, s3_upload_service_1.uploadFileToS3)(mockBuffer, "application/pdf", "sfsf", s3ClientMock);
        expect(result.status).toBe(200);
        expect(result.message).toBe("new file uploaded to s3 bucket");
    }));
    // test("s3 error", async () => {
    // 	//mock all dependencies
    // 	const generateUniqueId = jest.fn().mockReturnValue("mocked-unique-id");
    // 	s3ClientMock.on(PutObjectCommand).resolves();
    // 	const hexString =
    // 		"255044462d312e370d0a25b5b5b5b50d0a312030206f626a0d0a3c3c2f547970652f436174616c6f672f5061676573203220";
    // 	const mockBuffer = Buffer.from(hexString, "hex");
    // 	const result = await uploadFileToS3(mockBuffer, "application/pdf", "sfsf", s3ClientMock);
    // 	expect(result.status).toBe(200);
    // 	expect(result.message).toBe("new file uploaded to s3 bucket");
    // });
});
