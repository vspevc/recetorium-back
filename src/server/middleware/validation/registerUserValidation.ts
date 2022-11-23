import { Joi } from "express-validation";

const registerUserValidation = {
  body: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).max(30).required(),
    passwordConfirm: Joi.ref("password"),
    email: Joi.string().email().required(),
  }),
};

export default registerUserValidation;
