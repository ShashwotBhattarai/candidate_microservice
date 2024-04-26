import Joi from "joi";
import { fullNameRegex } from "./regex";

export const validateCandidateSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(30)
    .pattern(new RegExp(fullNameRegex))
    .required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(10).max(14).optional().allow(null),
});
