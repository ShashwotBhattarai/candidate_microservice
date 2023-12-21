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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findCurrentUserId_service_1 = require("../services/findCurrentUserId.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("findCurrentUserId test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("returns user id", () => __awaiter(void 0, void 0, void 0, function* () {
        const signSpy = jest.spyOn(jsonwebtoken_1.default, "verify");
        signSpy.mockImplementation(() => {
            return { user_id: "ksvfhjsvfh" };
        });
        const finalResult = yield (0, findCurrentUserId_service_1.findCurrentuserId)("kjfy64r532");
        expect(finalResult).toBe("ksvfhjsvfh");
    }));
});
