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
exports.S3UploadService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
const generate_unique_id_1 = __importDefault(require("generate-unique-id"));
(0, dotenv_1.config)();
class S3UploadService {
    uploadFileToS3(buffer, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
                },
                region: process.env.AWS_REGION || "",
            });
            const command = new client_s3_1.PutObjectCommand({
                Bucket: "resumetrackerbucket",
                Key: (0, generate_unique_id_1.default)(),
                Body: buffer,
                ContentType: type,
            });
            try {
                const response = yield client.send(command);
                return { status: 201, message: "file uploaded s3 bucket" };
            }
            catch (err) {
                return {
                    status: 500,
                    message: err,
                };
            }
        });
    }
}
exports.S3UploadService = S3UploadService;
