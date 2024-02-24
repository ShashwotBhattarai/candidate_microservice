jest.mock("generate-unique-id", () => {
  return {
    __esModule: true, // This is required for modules with no default export
    default: jest.fn().mockReturnValue("mocked-unique-id"),
  };
});
import { constructEmailPayload } from "../services/constructEmailPayload.service";
import { CandidateInfo } from "../models/cadidateInfo.model";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");
describe("registerNewUser", () => {
  test("email payload is returned", async () => {
    mockingoose(CandidateInfo).toReturn(
      { email: "abcd@gmail.com", fullname: "shashwot" },
      "findOne",
    );

    const finalResult = await constructEmailPayload("23fsf", "subject", "text");
    const response = {
      to: "abcd@gmail.com",
      subject: "Hi shashwot subject",
      text: "text",
    };

    expect(finalResult).toEqual(response);
  });

  test("database error 1", async () => {
    mockingoose(CandidateInfo).toReturn(new Error("Database error"), "findOne");

    try {
      await constructEmailPayload("23fsf", "subject", "text");
    } catch (error) {
      expect(error).toEqual(new Error("error in constructemailpayload"));
    }
  });

  test("database error 2", async () => {
    mockingoose(CandidateInfo).toReturn(null, "findOne");

    try {
      await constructEmailPayload("23fsf", "subject", "text");
    } catch (error) {
      expect(error).toEqual(new Error("error in constructemailpayload"));
    }
  });
});
