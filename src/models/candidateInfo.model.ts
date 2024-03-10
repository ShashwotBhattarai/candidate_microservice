import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const candidateInfoSchema = new Schema(
  {
    user_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    aws_file_key: { type: String },
  },
  { timestamps: true },
);

export const CandidateInfo = model("CandidateInfo", candidateInfoSchema);
