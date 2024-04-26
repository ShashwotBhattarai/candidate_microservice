jest.mock("generate-unique-id", () => {
  return {
    __esModule: true, // This is required for modules with no default export
    default: jest.fn().mockReturnValue("mocked-unique-id"),
  };
});
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";
import { SQSService } from "../services/sqs.service";

describe("Sqs service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sqs message gets sent to queue", async () => {
    //mock all dependencies
    const sqsClientMock = mockClient(SQSClient);

    sqsClientMock.on(SendMessageCommand).resolves({
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
    const result = await new SQSService().sendMessageToQueue(emailPayload);

    expect(result.status).toBe(200);
  });

  test("sqs error occures", async () => {
    mockClient(SQSClient).rejects(new Error("SQS Error"));

    const emailPayload = {
      to: "babudallay@gmail.com",
      subject: "new user created",
      text: "your user has been created",
    };

    try {
      await new SQSService().sendMessageToQueue(emailPayload);
    } catch (error) {
      expect(error).toEqual(new Error(`error in sendMessageToQueue`));
    }
  });
});
