import { findCurrentuserId } from "../services/findCurrentUserId.service";
import jwt from "jsonwebtoken";

describe("findCurrentUserId test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns user id", async () => {
    const signSpy = jest.spyOn(jwt, "verify");
    signSpy.mockImplementation(() => {
      return { user_id: "ksvfhjsvfh" };
    });
    const finalResult = await findCurrentuserId("kjfy64r532");
    expect(finalResult).toBe("ksvfhjsvfh");
  });
});
