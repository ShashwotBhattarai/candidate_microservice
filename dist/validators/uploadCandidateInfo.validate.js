"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCandidateInfo = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateCandidateInfo = joi_1.default.object({
    fullname: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().min(10).max(14)
});
