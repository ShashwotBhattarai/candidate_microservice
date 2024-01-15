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
const findCurrentuserIdModule = __importStar(require("../services/findCurrentUserId.service"));
const findCurrentuserIdModuleSpy = jest.spyOn(findCurrentuserIdModule, "findCurrentuserId");
findCurrentuserIdModuleSpy.mockResolvedValue("agvfe6");
const findSavedS3key_service_1 = require("../services/findSavedS3key.service");
const mockingoose = require("mockingoose");
describe("findSavedKey", () => {
    test("key is found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({ aws_file_key: "gf6487gf" }, "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(200);
        expect(finalResult.message).toBe("old file key found");
    }));
    test("key is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn({ aws_file_key: null }, "findOne");
        const finalResult = yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        expect(finalResult.status).toBe(204);
        expect(finalResult.message).toBe("old file key not found");
    }));
    test("user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(null, "findOne");
        try {
            yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        }
        catch (error) {
            expect(error).toEqual(new Error("error in findSavedS3key"));
        }
    }));
    test("key is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockingoose(cadidateInfo_models_1.CandidateInfo).toReturn(new Error("db error"), "findOne");
        try {
            yield (0, findSavedS3key_service_1.findSavedS3key)("7ggfjafhyjfsf");
        }
        catch (error) {
            expect(error).toEqual(new Error("error in findSavedS3key"));
        }
    }));
});
