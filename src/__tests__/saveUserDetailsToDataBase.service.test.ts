// import { CandidateInfo } from "../database/models/cadidateInfo.models";
// import { constructEmailPayload } from "../services/constructEmailPayload.service";
// import { findCurrentuserId } from "../services/findCurrentUserId.service";

// import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";

// const mockingoose = require("mockingoose");
// jest.mock("../services/findCurrentUserId.service");

// describe("saveUserDetailsToDataBase", () => {
// 	test("saved", async () => {
// 		const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

// 		mockingoose(CandidateInfo).toReturn({
//             fullname: "body.fullname",
//             email: "body.email",
//             phone_number: "body.phone_number",
//             local_file_name: "file?.filename",
//             file_size_in_bytes: "file?.size",
//         }, "findOneAndUpdate");

// 		const finalResult = await saveUserDetailsToDatabase();
// 		const response = {
// 			to: "abcd@gmail.com",
// 			subject: "Hi shashwot subject",
// 			text: "text",
// 		};
// 		expect(finalResult?.status).toBe(200);
// 		expect(finalResult.message).toEqual(response);
// 	});

// 	test("database error", async () => {
// 		// const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

// 		mockingoose(CandidateInfo).toReturn(new Error("Database error"), "findOne");

// 		const finalResult = await constructEmailPayload("23fsf", "subject", "text");

// 		expect(finalResult?.status).toBe(500);
// 	});

// 	test("database error", async () => {
// 		// const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");

// 		mockingoose(CandidateInfo).toReturn(null, "findOne");

// 		const finalResult = await constructEmailPayload("23fsf", "subject", "text");

// 		expect(finalResult?.status).toBe(500);
// 		expect(finalResult.message).toBe("unknown error occured");
// 	});
// });
