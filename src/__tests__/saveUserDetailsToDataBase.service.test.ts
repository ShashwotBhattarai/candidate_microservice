import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { constructEmailPayload } from "../services/constructEmailPayload.service";
import { findCurrentuserId } from "../services/findCurrentUserId.service";

import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";

const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");

describe("saveUserDetailsToDataBase", () => {
	test("saved", async () => {
		const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
		const mockFile = {
			fieldname: "cv",
			originalname: "SLC.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: "buffermock",
			size: 473672,
		};

		const bodyMock = {
			fullname: "my name bahubali surya",
			email: "acstockthankot@gmail.com",
			phone_number: "+9779800000002",
		};
		const accessTokenMock =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
		mockingoose(CandidateInfo).toReturn(
			{
				user_id: "sfhb45",
				fullname: "fulname mock",
				email: "mai@email.com",
				phone_number: "846856544368",
				local_file_name: "filename",
				file_size_in_bytes: 625251,
				aws_file_key: "fashg366",
			},
			"findOneAndUpdate"
		);

		const finalResult = await saveUserDetailsToDatabase(mockFile, bodyMock, accessTokenMock);
		const response = {
			user_id: "sfhb45",
			fullname: "fulname mock",
			email: "mai@email.com",
			phone_number: "846856544368",
			local_file_name: "filename",
			file_size_in_bytes: 625251,
			aws_file_key: "fashg366",
		};
		expect(finalResult?.status).toBe(200);
		expect(finalResult.data).toBeInstanceOf(CandidateInfo);
	});

	test("database error", async () => {
		const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
		const mockFile = {
			fieldname: "cv",
			originalname: "SLC.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: "buffermock",
			size: 473672,
		};

		const bodyMock = {
			fullname: "my name bahubali surya",
			email: "acstockthankot@gmail.com",
			phone_number: "+9779800000002",
		};
		const accessTokenMock =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
		mockingoose(CandidateInfo).toReturn(
			new Error("error in database in saveUserDetailsToDatabase"),
			"findOneAndUpdate"
		);

		const finalResult = await saveUserDetailsToDatabase(mockFile, bodyMock, accessTokenMock);
		expect(finalResult?.status).toBe(500);
		expect(finalResult.data).toBeInstanceOf(Error);
		expect(finalResult.message).toBe("error in database in saveUserDetailsToDatabase");
	});
});
