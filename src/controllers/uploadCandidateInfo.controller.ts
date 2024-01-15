import { Request, Response } from "express";
import { uploadCandidateInfoService } from "../services/uploadCandidateInfo.service";
export const uploadCandidateInfoController = (req: Request, res: Response) => {
	(async () => {
		try {
			if (req.headers.authorization !== null && req.headers.authorization !== undefined) {
				const currentToken = req.headers.authorization;
				const { status, message, data } = await uploadCandidateInfoService(
					currentToken,
					req.file,
					req.body
				);

				res.status(status).json({ message: message, data: data });
			} else {
				res.status(400).json({ error: "Authorization header missing" });
			}
		} catch {
			res.status(500).json({ error: "Internal server error" });
		}
	})();
};
