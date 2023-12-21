import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import generateUniqueId = require("generate-unique-id");
import { uploadFileToS3 } from "../services/s3-upload.service";

describe("Sqs service", () => {
	const s3ClientMock = mockClient(S3Client);
	beforeEach(() => {
		jest.clearAllMocks();
		s3ClientMock.reset();
	});

	test("file gets uploaded to s3", async () => {
		//mock all dependencies
		const generateUniqueId = jest.fn().mockReturnValue("mocked-unique-id");

		s3ClientMock.on(PutObjectCommand).resolves({
			$metadata: {
				httpStatusCode: 200,
				requestId: "6b3e8e90-5cc2-5ab0-8271-d36853268a0e",
				extendedRequestId: undefined,
				cfId: undefined,
				attempts: 1,
				totalRetryDelay: 0,
			},
		});

		const hexString =
			"255044462d312e370d0a25b5b5b5b50d0a312030206f626a0d0a3c3c2f547970652f436174616c6f672f5061676573203220";
		const mockBuffer = Buffer.from(hexString, "hex");

		const result = await uploadFileToS3(mockBuffer, "application/pdf", "sfsf", s3ClientMock);

		expect(result.status).toBe(200);
		expect(result.message).toBe("new file uploaded to s3 bucket");
	});

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
