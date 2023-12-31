import { createS3Client } from "../services/createS3Client.service";
import { S3Client } from "@aws-sdk/client-s3";

describe("createS3", () => {
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

	it("should return an S3Client", async () => {
		const response = await createS3Client();
		expect(response.status).toEqual(200);
		expect(response.message).toEqual("S3 Client created");
		expect(response.data).toBeInstanceOf(S3Client);
	});
	it("should throw an error if environment variables are missing", async () => {
		delete process.env.AWS_ACCESS_KEY_ID;
		delete process.env.AWS_SECRET_ACCESS_KEY;
		delete process.env.AWS_REGION;

		await expect(createS3Client()).rejects.toEqual({
			status: 500,
			message: "error in createS3Client",
			data: null,
		});
	});
});
