"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInfo = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const candidateInfoSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
        default: uuid_1.v4,
        unique: true,
        required: true,
    },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    local_file_name: { type: String },
    file_size_in_bytes: { type: Number },
    aws_file_key: { type: String },
});
exports.CandidateInfo = (0, mongoose_1.model)("CandidateInfo", candidateInfoSchema);
