"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCandidate = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCandidateSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().min(10).max(14),
});
const validateCandidate = (req, res, next) => {
    const { error } = validateCandidateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateCandidate = validateCandidate;
