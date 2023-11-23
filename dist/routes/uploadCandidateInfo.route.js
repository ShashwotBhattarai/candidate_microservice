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
    const saveUserDetailsServiceResponse = yield (0, saveUserDetailsToDatabase_service_1.saveUserDetailsToDatabase)(req.file, req.body, req.headers.authorization || "");
    const uploadFileResponse = yield new s3_upload_service_1.S3UploadService().uploadFileToS3(req.file.buffer, req.file.mimetype);
    if (saveUserDetailsServiceResponse.status &&
        uploadFileResponse.status == 201) {
        res.status(201).json({
            message1: saveUserDetailsServiceResponse.message,
            message2: uploadFileResponse.message,
        });
    }
    else if (saveUserDetailsServiceResponse.status == 500) {
        res.status(500).json({
            error: saveUserDetailsServiceResponse.message,
        });
    }
    else if (uploadFileResponse.status == 500) {
        res.status(500).json({
            error: uploadFileResponse.message,
        });
    }
    else {
        res.status(500).json({
            error1: saveUserDetailsServiceResponse.message,
            error2: uploadFileResponse.message,
        });
    }
    //   try {
    //     const messageBody = req.file?.buffer;//need to change this into a
    //     const result = await sqsService.sendMessage(queueUrl, messageBody);
    //     console.log(result)
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //   }
    //   res.status(200).json("ok");
}));
exports.default = router;
