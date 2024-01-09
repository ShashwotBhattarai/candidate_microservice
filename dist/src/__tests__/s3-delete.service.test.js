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
const s3_delete_service_1 = require("../services/s3-delete.service");
describe("S3 file delete service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("file gets deleted from s3", () => __awaiter(void 0, void 0, void 0, function* () {
        //mock all dependencies
        const s3ClientMock = (0, aws_sdk_client_mock_1.mockClient)(client_s3_1.S3Client);
        s3ClientMock.on(client_s3_1.DeleteObjectCommand).resolves({
            $metadata: {
                httpStatusCode: 200,
                requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
        });
        const result = yield (0, s3_delete_service_1.deleteFileFromS3)("fasjf546");
        expect(result.status).toBe(200);
        expect(result.message).toBe("old file deleted from s3");
    }));
    test("s3 error", () => __awaiter(void 0, void 0, void 0, function* () {
        //mock all dependencies
        const s3ClientMock = (0, aws_sdk_client_mock_1.mockClient)(client_s3_1.S3Client).rejects(new Error("s3 error"));
        const result = yield (0, s3_delete_service_1.deleteFileFromS3)("fasjf546");
        expect(result.status).toBe(500);
        expect(result.message).toBe("s3 delete error");
    }));
});
