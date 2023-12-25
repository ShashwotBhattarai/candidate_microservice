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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const saveUserDetailsToDatabaseModule = __importStar(require("../services/saveUserDetailsToDatabase.service"));
const uploadCandidateInfo_service_1 = __importDefault(require("../services/uploadCandidateInfo.service"));
const mockingoose = require("mockingoose");
describe("uploadCandidateInfo Service", () => {
    test("saveUserDetailsToDatabase", () => __awaiter(void 0, void 0, void 0, function* () {
        const saveUserDetailsToDatabaseSpy = jest.spyOn(saveUserDetailsToDatabaseModule, "saveUserDetailsToDatabase");
        // Changed mock implementation to match expected return type
        saveUserDetailsToDatabaseSpy.mockResolvedValue({
            status: 500,
            message: "error in database in saveUserDetailsToDatabase",
            data: { error: "error sd" },
        });
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
        const accessTokenMock = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZlNTRkMmMtMjFjNy00OWViLTk5MjQtZjE2NmM5ZWU3NWE0IiwidXNlcm5hbWUiOiJzdXJ5YSIsInJvbGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3MDMxNTIwNzYsImV4cCI6MTcwMzIzODQ3Nn0.wJRv5u4ILchkcc2Q8vM6l1bw58cj53c-jNane_JpzWI";
        const finalResult = yield (0, uploadCandidateInfo_service_1.default)(accessTokenMock, mockFile, bodyMock);
        expect(finalResult.status).toBe(500);
        expect(finalResult.message).toBe("error in database in saveUserDetailsToDatabase");
    }));
});
