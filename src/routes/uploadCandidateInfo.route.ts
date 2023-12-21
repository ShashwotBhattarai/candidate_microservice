import express, { Request, Response, Router, response } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";
import { json } from "node:stream/consumers";

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
		const { status, message, data } = await uploadCandidateInfoService(req);

		res.status(status).json({ message: message, data: data });
	}
);

export default router;
