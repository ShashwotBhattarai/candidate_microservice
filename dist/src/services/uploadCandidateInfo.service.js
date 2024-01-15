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
const saveUserDetailsToDatabase_service_1 = require("./saveUserDetailsToDatabase.service");
const s3_upload_service_1 = require("./s3-upload.service");
const findSavedS3key_service_1 = require("./findSavedS3key.service");
const s3_delete_service_1 = require("./s3-delete.service");
const updateAwsKeyInDatabase_service_1 = require("./updateAwsKeyInDatabase.service");
const constructEmailPayload_service_1 = require("./constructEmailPayload.service");
const sqs_service_1 = require("./sqs.service");
const email_templets_1 = require("../constants/email.templets");
function uploadCandidateInfoService(currentToken, reqFile, reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!reqFile) {
            return { status: 400, message: "File buffer is missing", data: null };
        }
        try {
            yield (0, saveUserDetailsToDatabase_service_1.saveUserDetailsToDatabase)(reqFile, reqBody, currentToken);
            const uploadFileResponse = yield (0, s3_upload_service_1.uploadFileToS3)(reqFile.buffer, reqFile.mimetype, reqFile.originalname);
            const newKey = uploadFileResponse.data;
            const subject = email_templets_1.CVUploadedEmailTemplate.subject;
            const text = email_templets_1.CVUploadedEmailTemplate.text;
            const emailPayload = yield (0, constructEmailPayload_service_1.constructEmailPayload)(currentToken, subject, text);
            yield new sqs_service_1.SQSService().sendMessageToQueue(emailPayload);
            const findSavedS3keyResponse = yield (0, findSavedS3key_service_1.findSavedS3key)(currentToken);
            if (findSavedS3keyResponse.status == 200) {
                const oldKey = findSavedS3keyResponse.data;
                yield (0, s3_delete_service_1.deleteFileFromS3)(oldKey);
            }
            yield (0, updateAwsKeyInDatabase_service_1.updateAwsKeyInDatabase)(currentToken, newKey);
            return {
                status: 200,
                message: "candidate details upload successfull",
                data: null,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: "upload candidate service error",
                data: error,
            };
        }
    });
}
exports.default = uploadCandidateInfoService;
