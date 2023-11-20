import express, { Request, Response, Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";

import { SQSService } from '../services/sqs.service';
import { sqs } from '../config/aws.config';

const sqsService = new SQSService(sqs);
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/750889590187/fileUploadQueue.fifo';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();

router.post(
  "/",
  upload.single("cv"),
  // authMiddleware(["candidate"]),
  validateCandidate,
  checkFileMiddleware,
  async (req: Request, res: Response) => {
    // const saveUserDetailsServiceResponse= await saveUserDetailsToDatabase(
    //   req.file,
    //   req.body,
    //   req.headers.authorization || ""
    // );
    // res.status(saveUserDetailsServiceResponse.status).json(saveUserDetailsServiceResponse.message);

    console.log(req.file);


    try {
      const messageBody = "req.file will go here";
      const result = await sqsService.sendMessage(queueUrl, messageBody);
      console.log(result)
    } catch (error) {
      console.error('Error sending message:', error);
    }
    
    res.status(200).json("ok");


  }
);

export default router;
