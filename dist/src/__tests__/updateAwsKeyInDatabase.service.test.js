"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const findCurrentuserIdModule = __importStar(require("../services/findCurrentUserId.service"));
const findCurrentuserIdModuleSpy = jest.spyOn(findCurrentuserIdModule, "findCurrentuserId");
findCurrentuserIdModuleSpy.mockResolvedValue("agvfe6");
const mockingoose = require("mockingoose");
describe("Update aws key in database", () => {
    test("updated", () => __awaiter(void 0, void 0, void 0, function* () {
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
        expect(finalResult.status).toBe(200);
    }));
    test("database error", () => __awaiter(void 0, void 0, void 0, function* () {
        const newKeyMock = "fsfsfsf435";
        const accessTokenMock = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(new Error("database error in updateAwsKeyInDatabase"), "findOneAndUpdate");
        try {
            yield (0, updateAwsKeyInDatabase_service_1.updateAwsKeyInDatabase)(accessTokenMock, newKeyMock);
        }
        catch (error) {
            expect(error).toEqual(new Error("error in updateAwsKeyInDatabase"));
        }
    }));
});
