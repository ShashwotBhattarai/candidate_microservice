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
jest.mock("generate-unique-id", () => {
    return {
        __esModule: true, // This is required for modules with no default export
        default: jest.fn().mockReturnValue("mocked-unique-id"),
    };
});
const client_sqs_1 = require("@aws-sdk/client-sqs");
const aws_sdk_client_mock_1 = require("aws-sdk-client-mock");
const sqs_service_1 = require("../services/sqs.service");
describe("Sqs service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("sqs message gets sent to queue", () => __awaiter(void 0, void 0, void 0, function* () {
        //mock all dependencies
        const sqsClientMock = (0, aws_sdk_client_mock_1.mockClient)(client_sqs_1.SQSClient);
        sqsClientMock.on(client_sqs_1.SendMessageCommand).resolves({
            $metadata: {
                httpStatusCode: 200,
                requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
            MD5OfMessageAttributes: "8364c9f86971581747998a1be1bc61a7",
            MD5OfMessageBody: "3f4c3c36d1208f4bd292aabf8b295141",
            MessageId: "55029f88-98f9-41ef-88b0-e777c7da7629",
            SequenceNumber: "74222882815101630464",
        });
        const emailPayload = {
            to: "babudallay@gmail.com",
            subject: "new user created",
            text: "your user has been created",
        };
        const result = yield new sqs_service_1.SQSService().sendMessageToQueue(emailPayload);
        expect(result.status).toBe(200);
    }));
    test("sqs error occures", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, aws_sdk_client_mock_1.mockClient)(client_sqs_1.SQSClient).rejects(new Error("SQS Error"));
        const emailPayload = {
            to: "babudallay@gmail.com",
            subject: "new user created",
            text: "your user has been created",
        };
        try {
            yield new sqs_service_1.SQSService().sendMessageToQueue(emailPayload);
        }
        catch (error) {
            expect(error).toEqual(new Error(`error in sendMessageToQueue`));
        }
    }));
});
