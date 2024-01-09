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
const createS3Client_service_1 = require("../services/createS3Client.service");
const client_s3_1 = require("@aws-sdk/client-s3");
describe("createS3", () => {
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules(); // Resets the module registry - the cache of all required modules
        process.env = Object.assign({}, originalEnv); // Make a copy
        process.env.AWS_ACCESS_KEY_ID = "testAccessKeyId";
        process.env.AWS_SECRET_ACCESS_KEY = "testSecretAccessKey";
        process.env.AWS_REGION = "testRegion";
    });
    afterEach(() => {
        process.env = originalEnv; // Restore original environment
    });
    it("should return an S3Client", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, createS3Client_service_1.createS3Client)();
        expect(response.status).toEqual(200);
        expect(response.message).toEqual("S3 Client created");
        expect(response.data).toBeInstanceOf(client_s3_1.S3Client);
    }));
    it("should throw an error if environment variables are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete process.env.AWS_ACCESS_KEY_ID;
        delete process.env.AWS_SECRET_ACCESS_KEY;
        delete process.env.AWS_REGION;
        yield expect((0, createS3Client_service_1.createS3Client)()).rejects.toEqual({
            status: 500,
            message: "error in createS3Client",
            data: null,
        });
    }));
});
