import { CandidateInfo } from "../models/cadidateInfo.model";
import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";
import * as findCurrentuserIdModule from "../services/findCurrentUserId.service";
const findCurrentuserIdModuleSpy = jest.spyOn(
  findCurrentuserIdModule,
  "findCurrentuserId",
);
findCurrentuserIdModuleSpy.mockResolvedValue("agvfe6");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");

describe("saveUserDetailsToDataBase", () => {
  test("saved", async () => {
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
      "findOneAndUpdate",
    );

    const finalResult = await saveUserDetailsToDatabase(
      mockFile,
      bodyMock,
      accessTokenMock,
    );
    expect(finalResult.status).toBe(200);
  });

  test("database error", async () => {
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
      "findOneAndUpdate",
    );

    try {
      await saveUserDetailsToDatabase(mockFile, bodyMock, accessTokenMock);
    } catch (error) {
      expect(error).toEqual(new Error("error in saveUserDetailsToDatabase"));
    }
  });
});
