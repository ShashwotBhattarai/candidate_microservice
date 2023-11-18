import express, { Request, Response, Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { saveUserDetailsToDatabase } from "../services/saveUserDetailsToDatabase.service";

const upload = multer({
  dest: "uploads/",
});

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
    res.status(200).json("ok");
  }
);

export default router;
