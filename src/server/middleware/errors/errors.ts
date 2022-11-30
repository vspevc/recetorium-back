import "../../../loadEnvironment.js";
import type { ErrorRequestHandler, RequestHandler } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import { ValidationError } from "express-validation";
import { MongoServerError } from "mongodb";
import CustomError from "../../../CustomError/CustomError.js";
import serverCustomErrors from "../../../CustomError/serverErrorMessages.js";

const debug = debugCreator("recetorium:server:error");
const { notFoundErrorMessage, unknownServerErrorMessage } = serverCustomErrors;

export const notFoundError: RequestHandler = (req, res, next) => {
  const { message, publicMessage, statusCode } = notFoundErrorMessage(req.path);

  const error = new CustomError(message, publicMessage, statusCode);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  error: CustomError,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next
) => {
  let statusCode = error.statusCode ?? 500;
  let publicMessage = error.publicMessage || unknownServerErrorMessage;

  if (error instanceof MongoServerError && error.code === 11000) {
    publicMessage = "User already exists.";
    statusCode = 400;
  }

  if (error instanceof ValidationError) {
    const errorMessages: string[] = [];

    if (error.details.body) {
      errorMessages.push(
        ...error.details.body.map((errorDetail) => errorDetail.message)
      );
    }

    if (error.details.query) {
      errorMessages.push(
        ...error.details.query.map((errorDetail) => errorDetail.message)
      );
    }

    error.message = errorMessages.join("\n");
    publicMessage = errorMessages.join(", ");
    statusCode = 400;
  }

  debug(chalk.red.bold(error.message));

  res.status(statusCode).json({ error: publicMessage });
};
