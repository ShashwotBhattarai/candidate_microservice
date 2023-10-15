"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileMiddleware = void 0;
const checkFileMiddleware = (req, res, next) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ error: "No file uploaded. Please upload your CV" });
    }
    console.log(req.file.size);
    if (req.file.size >= 1000000) {
        return res
            .status(400)
            .json({
            error: "File size exceeding 1MB, please make sure your file is less than 1MB in Size",
        });
    }
    next();
};
exports.checkFileMiddleware = checkFileMiddleware;
