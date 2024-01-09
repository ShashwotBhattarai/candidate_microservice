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
const findSavedS3key_service_1 = require("../services/findSavedS3key.service");
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");
describe("findSavedKey", () => {
    test("key is found", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({ aws_file_key: "gf6487gf" }, "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(200);
        expect(finalResult.message).toBe("old file key found");
    }));
    test("key is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({ aws_file_key: null }, "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(204);
        expect(finalResult.message).toBe("old file key not found");
    }));
    test("user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(null, "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(500);
        expect(finalResult.message).toBe("unknown error occured in findSavedS3key");
    }));
    test("key is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const findCurrentuserId = jest.fn().mockImplementation(() => "agvfe6");
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(new Error("db error"), "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(500);
        expect(finalResult.data).toBeInstanceOf(Error);
        expect(finalResult.message).toBe("eror in findSavedS3key");
    }));
});
