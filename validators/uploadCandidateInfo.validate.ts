import Joi from 'joi';

export const validateCandidateInfo = Joi.object({
    fullname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().min(10).max(14)
  });