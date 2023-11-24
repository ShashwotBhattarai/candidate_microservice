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
const express_1 = __importDefault(require("express"));
const uploadCandidateInfo_validate_1 = require("../validators/uploadCandidateInfo.validate");
const checkFile_middleware_1 = require("../middlewares/checkFile.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const saveUserDetailsToDatabase_service_1 = require("../services/saveUserDetailsToDatabase.service");
const s3_upload_service_1 = require("../services/s3-upload.service");
const findSavedS3key_service_1 = require("../services/findSavedS3key.service");
const s3_delete_service_1 = require("../services/s3-delete.service");
// import { sqs } from "../config/aws.config";
// const sqsService = new SQSService(sqs);
// const queueUrl =
//   "https://sqs.us-east-1.amazonaws.com/750889590187/fileUploadQueue.fifo";
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.post("/", upload.single("cv"), (0, auth_middleware_1.authMiddleware)(["candidate"]), uploadCandidateInfo_validate_1.validateCandidate, checkFile_middleware_1.checkFileMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json("File or file buffer is missing");
    }
    let status1;
    let message1;
    let status2;
    let message2;
    let newKey = "";
    let status3;
    let message3;
    let oldKey = "";
    let status4;
    let message4;
    let status5;
    let message5;
    const saveUserDetailsServiceResponse = yield (0, saveUserDetailsToDatabase_service_1.saveUserDetailsToDatabase)(req.file, req.body, req.headers.authorization || "");
    if (saveUserDetailsServiceResponse.status == 201) {
        status1 = 200;
        message1 = saveUserDetailsServiceResponse.message;
    }
    else {
        status1 = 500;
        message1 = saveUserDetailsServiceResponse.message;
    }
    const uploadFileResponse = yield new s3_upload_service_1.S3UploadService().uploadFileToS3(req.file.buffer, req.file.mimetype);
    if (uploadFileResponse.status == 201) {
        status2 = 200;
        message2 = uploadFileResponse.message;
        newKey = uploadFileResponse.Key || "";
    }
    else {
        status2 = 500;
        message2 = uploadFileResponse.message;
    }
    const findSavedS3keyResponse = yield (0, findSavedS3key_service_1.findSavedS3key)(req.headers.authorization || "");
    if (findSavedS3keyResponse.status == 200) {
        status3 = 200;
        message3 = findSavedS3keyResponse.message;
        oldKey = findSavedS3keyResponse.key || "";
    }
    else {
        status3 = 500;
        message3 = findSavedS3keyResponse.message;
    }
    if (status3 && status2 == 200) {
        const deleteFileResponse = yield new s3_delete_service_1.S3DeleteService().deleteFileFromS3(oldKey);
        if (deleteFileResponse.status == 201) {
            status4 = 200;
            message4 = deleteFileResponse.message;
        }
        else {
            status4 = 500;
            message4 = deleteFileResponse.message;
        }
    }
    else {
        message4 = "no file to delete from s3";
    }
    const updateAwsKeyInDatabaseResponse = yield (0, saveUserDetailsToDatabase_service_1.updateAwsKeyInDatabase)(req.headers.authorization || "", newKey);
    if (updateAwsKeyInDatabaseResponse.status == 200) {
        status5 = 200;
        message5 = updateAwsKeyInDatabaseResponse.message;
    }
    else {
        status5 = 500;
        message5 = updateAwsKeyInDatabaseResponse.message;
    }
    if (status1 && status2 && status5) {
        res.status(200).json({
            message1: message1,
            message2: message2,
            message3: message3,
            message4: message4,
            message5: message5,
        });
    }
    else {
        res.status(500).json({
            message1: message1,
            message2: message2,
            message3: message3,
            message4: message4,
            message5: message5,
        });
    }
}));
exports.default = router;
