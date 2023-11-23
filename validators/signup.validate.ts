import Joi from 'joi';

export const validateSignupInput = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email(),
    role: Joi.string().min(9).max(9)
  });