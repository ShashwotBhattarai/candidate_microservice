import { NextFunction, Request, Response } from "express";

export const checkFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded. Please upload your CV" });
	}
	if (!req.file.buffer) {
		return res.status(400).json("File buffer is missing");
	}
	if (req.file.size > 256 * 1024) {
		return res.status(400).json({
			error: "File size exceeding 256kb, please make sure your file is less than 256kb in Size",
		});
	}
	next();
};
