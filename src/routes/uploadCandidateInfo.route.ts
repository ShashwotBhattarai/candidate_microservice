import express, { Request, Response, Router } from "express";
import { validateCandidate } from "../validators/uploadCandidateInfo.validate";
import { checkFileMiddleware } from "../middlewares/checkFile.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import uploadCandidateInfoService from "../services/uploadCandidateInfo.service";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 100000,
	},
});

const router: Router = express.Router();

router.post(
	"/",
	upload.single("cv"),
	authMiddleware(["candidate"]),
	validateCandidate,
	checkFileMiddleware,
	async (req: Request, res: Response) => {
		const currentToken = req.headers.authorization ?? "";
		const { status, message, data } = await uploadCandidateInfoService(currentToken, req.file, req.body);

		res.status(status).json({ message: message, data: data });
	}
);

export default router;
