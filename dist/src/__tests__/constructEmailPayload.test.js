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
jest.mock("generate-unique-id", () => {
    return {
        __esModule: true, // This is required for modules with no default export
        default: jest.fn().mockReturnValue("mocked-unique-id"),
    };
});
const constructEmailPayload_service_1 = require("../services/constructEmailPayload.service");
const cadidateInfo_models_1 = require("../database/models/cadidateInfo.models");
const mockingoose = require("mockingoose");
jest.mock("../services/findCurrentUserId.service");
describe("registerNewUser", () => {
    test("email payload is returned", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({ email: "abcd@gmail.com", fullname: "shashwot" }, "findOne");
        const finalResult = yield (0, constructEmailPayload_service_1.constructEmailPayload)("23fsf", "subject", "text");
        const response = {
            to: "abcd@gmail.com",
            subject: "Hi shashwot subject",
            text: "text",
        };
        expect(finalResult).toEqual(response);
    }));
    test("database error 1", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(new Error("Database error"), "findOne");
        try {
            yield (0, constructEmailPayload_service_1.constructEmailPayload)("23fsf", "subject", "text");
        }
        catch (error) {
            expect(error).toEqual(new Error("error in constructemailpayload"));
        }
    }));
    test("database error 2", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(null, "findOne");
        try {
            yield (0, constructEmailPayload_service_1.constructEmailPayload)("23fsf", "subject", "text");
        }
        catch (error) {
            expect(error).toEqual(new Error("error in constructemailpayload"));
        }
    }));
});
