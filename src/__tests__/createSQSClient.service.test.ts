import { createSQSClient } from "../services/createSQSClient.service";
import { SQSClient } from "@aws-sdk/client-sqs";

describe("createSQSClient", () => {
	const originalEnv = process.env;
	beforeEach(() => {
		jest.resetModules(); // Resets the module registry - the cache of all required modules
		process.env = { ...originalEnv }; // Make a copy
		process.env.AWS_ACCESS_KEY_ID = "testAccessKeyId";
		process.env.AWS_SECRET_ACCESS_KEY = "testSecretAccessKey";
		process.env.AWS_REGION = "testRegion";
	});
	afterEach(() => {
		process.env = originalEnv; // Restore original environment
	});

	it("should return an SQSClient", async () => {
		const response = await createSQSClient();
		expect(response.status).toEqual(200);
		expect(response.message).toEqual("SQSClient created");
		expect(response.data).toBeInstanceOf(SQSClient);
	});
	it("should throw an error if environment variables are missing", async () => {
		delete process.env.AWS_ACCESS_KEY_ID;
		delete process.env.AWS_SECRET_ACCESS_KEY;
		delete process.env.AWS_REGION;

		await expect(createSQSClient()).rejects.toEqual({
			status: 500,
			message: "error in createSQSClient",
			data: null,
		});
	});
});
