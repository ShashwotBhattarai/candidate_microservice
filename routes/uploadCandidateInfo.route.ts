import express, { Request, Response, Router } from "express";
import { validateCandidateInfo } from "../validators/uploadCandidateInfo.validate";
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
  authMiddleware(["user"]),
  checkFileMiddleware,
  async (req: Request, res: Response) => {
    const { error } = validateCandidateInfo.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const saveUserDetailsServiceResponse= await saveUserDetailsToDatabase(
      req.file,
      req.body,
      req.headers.authorization || ""
    );
    res.status(saveUserDetailsServiceResponse.status).json(saveUserDetailsServiceResponse.message);

    

  }
);

export default router;
