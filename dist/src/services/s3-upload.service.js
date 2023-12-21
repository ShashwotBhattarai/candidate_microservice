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
exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function uploadFileToS3(buffer, type, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            },
            region: process.env.AWS_REGION || "",
        });
        const currentKey = Date.now() + "_" + filename;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: currentKey,
            Body: buffer,
            ContentType: type,
        });
        try {
            const response = yield client.send(command);
            return {
                status: 200,
                message: "new file uploaded to s3 bucket",
                data: currentKey,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: "s3 upload error",
                data: error,
            };
        }
    });
}
exports.uploadFileToS3 = uploadFileToS3;
