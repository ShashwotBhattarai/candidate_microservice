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

  it("responds with status: 200, message: messsage sent to sqs queue when message is sent to queue", async () => {
    const sqsClientMock = mockClient(SQSClient);

    sqsClientMock.on(SendMessageCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: "mockRequesID",
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
      MD5OfMessageAttributes: "mockMD5OfMessageAttributes",
      MD5OfMessageBody: "mockMD5OfMessageBody",
      MessageId: "mockMessageId",
      SequenceNumber: "mockSequenceNumber",
    });
    const emailPayload = {
      to: "babudallay@gmail.com",
      subject: "new user created",
      text: "your user has been created",
    };
    const result = await new SQSService().sendMessageToQueue(emailPayload);

    expect(result.status).toBe(200);
    expect(result.message).toBe("messsage sent to sqs queue");
  });

  it("throws an error:error in sendMessageToQueue if send operation fails", async () => {
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
