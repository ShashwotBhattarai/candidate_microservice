import { CandidateInfo } from "../models/cadidateInfo.model";
import * as findCurrentuserIdModule from "../services/findCurrentUserId.service";
const findCurrentuserIdModuleSpy = jest.spyOn(
  findCurrentuserIdModule,
  "findCurrentuserId",
);
findCurrentuserIdModuleSpy.mockResolvedValue("agvfe6");
import { findSavedS3key } from "../services/findSavedS3key.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");

describe("findSavedKey", () => {
  test("key is found", async () => {
    mockingoose(CandidateInfo).toReturn(
      { aws_file_key: "gf6487gf" },
      "findOne",
    );

    const finalResult = await findSavedS3key("7ggfjafhyjfsf");

    expect(finalResult.status).toBe(200);
    expect(finalResult.message).toBe("old file key found");
  });

  test("key is not found", async () => {
    mockingoose(CandidateInfo).toReturn({ aws_file_key: null }, "findOne");

    const finalResult = await findSavedS3key("7ggfjafhyjfsf");

    expect(finalResult.status).toBe(204);
    expect(finalResult.message).toBe("old file key not found");
  });

  test("user is not found", async () => {
    mockingoose(CandidateInfo).toReturn(null, "findOne");

    try {
      await findSavedS3key("7ggfjafhyjfsf");
    } catch (error) {
      expect(error).toEqual(new Error("error in findSavedS3key"));
    }
  });

  test("key is not found", async () => {
    mockingoose(CandidateInfo).toReturn(new Error("db error"), "findOne");

    try {
      await findSavedS3key("7ggfjafhyjfsf");
    } catch (error) {
      expect(error).toEqual(new Error("error in findSavedS3key"));
    }
  });
});
