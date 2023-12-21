"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cadidateInfo_models_1 = require("../database/models/cadidateInfo.models");
const updateAwsKeyInDatabase_service_1 = require("../services/updateAwsKeyInDatabase.service");
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");
describe("Update aws key in database", () => {
    test("updated", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        const newKeyMock = "fsfsfsf435";
        const accessTokenMock = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({
            user_id: "sfhb45",
            fullname: "fulname mock",
            email: "mai@email.com",
            phone_number: "846856544368",
            local_file_name: "filename",
            file_size_in_bytes: 625251,
            aws_file_key: "fashg366",
        }, "findOneAndUpdate");
        const finalResult = yield (0, updateAwsKeyInDatabase_service_1.updateAwsKeyInDatabase)(accessTokenMock, newKeyMock);
        const response = {
            user_id: "sfhb45",
            fullname: "fulname mock",
            email: "mai@email.com",
            phone_number: "846856544368",
            local_file_name: "filename",
            file_size_in_bytes: 625251,
            aws_file_key: "fashg366",
        };
        expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(200);
        expect(finalResult.data).toBeInstanceOf(cadidateInfo_models_1.CandidateInfo);
        expect(finalResult.message).toBe("new file key saved to database");
    }));
    test("database error", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        const newKeyMock = "fsfsfsf435";
        const accessTokenMock = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(new Error("database error in updateAwsKeyInDatabase"), "findOneAndUpdate");
        const finalResult = yield (0, updateAwsKeyInDatabase_service_1.updateAwsKeyInDatabase)(accessTokenMock, newKeyMock);
        expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(500);
        expect(finalResult.data).toBeInstanceOf(Error);
        expect(finalResult.message).toBe("database error in updateAwsKeyInDatabase");
    }));
});
