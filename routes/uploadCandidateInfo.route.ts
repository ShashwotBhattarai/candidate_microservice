import express, { Request, Response, Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";

import { S3UploadService } from "../services/s3-upload.service";

import { SQSService } from "../services/sqs.service";
import { sqs } from "../config/aws.config";

const sqsService = new SQSService(sqs);
const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/750889590187/fileUploadQueue.fifo";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();

router.post(
  "/",
  upload.single("cv"),
  authMiddleware(["candidate"]),
  validateCandidate,
  checkFileMiddleware,
  async (req: Request, res: Response) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json("File or file buffer is missing");
    }

    const saveUserDetailsServiceResponse = await saveUserDetailsToDatabase(
      req.file,
      req.body,
      req.headers.authorization || ""
    );

    const uploadFileResponse = await new S3UploadService().uploadFileToS3(
      req.file.buffer,
      req.file.mimetype
    );

    if (
      saveUserDetailsServiceResponse.status &&
      uploadFileResponse.status == 201
    ) {
      res.status(201).json({
        message1: saveUserDetailsServiceResponse.message,
        message2: uploadFileResponse.message,
      });
    } else if (saveUserDetailsServiceResponse.status == 500) {
      res.status(500).json({
        error: saveUserDetailsServiceResponse.message,
      });
    } else if (uploadFileResponse.status == 500) {
      res.status(500).json({
        error: uploadFileResponse.message,
      });
    } else {
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
  }
);

export default router;
