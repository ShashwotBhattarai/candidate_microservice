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
const createSQSClient_service_1 = require("../services/createSQSClient.service");
const client_sqs_1 = require("@aws-sdk/client-sqs");
describe("createSQSClient", () => {
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
    it("should return an SQSClient", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, createSQSClient_service_1.createSQSClient)();
        expect(response.status).toEqual(200);
        expect(response.message).toEqual("SQSClient created");
        expect(response.data).toBeInstanceOf(client_sqs_1.SQSClient);
    }));
    it("should throw an error if environment variables are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete process.env.AWS_ACCESS_KEY_ID;
        delete process.env.AWS_SECRET_ACCESS_KEY;
        delete process.env.AWS_REGION;
        yield expect((0, createSQSClient_service_1.createSQSClient)()).rejects.toEqual({
            status: 500,
            message: "error in createSQSClient",
            data: null,
        });
    }));
});
