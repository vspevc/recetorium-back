import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../../controllers/usersControllers/usersControllers.js";
import registerUserValidation from "../../middleware/validation/registerUserValidation.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(registerUserValidation, {}, { abortEarly: false }),
  registerUser
);

export default usersRouter;
