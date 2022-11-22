import "../../../loadEnvironment.js";
import type { ErrorRequestHandler, RequestHandler } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import CustomError from "../../../CustomError/CustomError.js";
import serverCustomErrors from "../../../CustomError/serverErrorMessages.js";

const debug = debugCreator("recetorium:server:error");

export const notFoundError: RequestHandler = (req, res, next) => {
  const { message, publicMessage, statusCode } =
    serverCustomErrors.notFoundError(req.path);

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
  const errorCode = error.statusCode ?? 500;
  const publicMessage = error.publicMessage || "Internal server error";

  debug(chalk.red.bold(error.message));

  res.status(errorCode).json({ error: publicMessage });
};
