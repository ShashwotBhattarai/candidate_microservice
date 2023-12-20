import { findCurrentuserId } from "../services/findCurrentUserId.service";
import jwt from "jsonwebtoken";

describe("findCurrentUserId test", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("returns user id", async () => {
		const signSpy = jest.spyOn(jwt, "verify");
		signSpy.mockImplementation(() => {
			user_id: "ksvfhjsvfh";
		});
		const finalResult = await findCurrentuserId("kjfy64r532");
		console.log(finalResult);
		expect(finalResult).toBe("ksvfhjsvfh");
		expect(await findCurrentuserId).toHaveReturned();
	});
});
