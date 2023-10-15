import express, { Request, Response, Router } from "express";
import { validateCandidateInfo } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

import multer from "multer";

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
    const file = req.file;

    console.log(file);
    console.log(req.body);
    res.send("file uploaded to gateway");
  }
);

export default router;
