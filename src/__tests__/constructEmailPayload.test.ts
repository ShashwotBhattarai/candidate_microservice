import { ConstructEmailPayload } from "../services/constructEmailPayload.service";
import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "../services/findCurrentUserId.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");
describe("registerNewUser", () => {
	test("email payload is returned", async () => {
		const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

		mockingoose(CandidateInfo).toReturn({ email: "abcd@gmail.com", fullname: "shashwot" }, "findOne");

		const finalResult = await new ConstructEmailPayload().constructEmailPayload("23fsf", "subject", "text");

		expect(finalResult?.status).toBe(200);
		expect(finalResult.message).toBe({
			to: "abcd@gmail.com",
			subject: "subject",
			text: "text",
		});
	});

	test("database error", async () => {
		// const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

		mockingoose(CandidateInfo).toReturn(new Error("Database error"), "findOne");

		const finalResult = await new ConstructEmailPayload().constructEmailPayload("23fsf", "subject", "text");

		expect(finalResult?.status).toBe(500);
	});

	test("database error", async () => {
		// const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

		mockingoose(CandidateInfo).toReturn(null, "findOne");

		const finalResult = await new ConstructEmailPayload().constructEmailPayload("23fsf", "subject", "text");

		expect(finalResult?.status).toBe(500);
		expect(finalResult.message).toBe("unknown error occured");
	});
});
