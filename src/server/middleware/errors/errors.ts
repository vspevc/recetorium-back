import "../../../loadEnvironment.js";
import type { ErrorRequestHandler } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import type CustomError from "../../../CustomError/CustomError.js";

const debug = debugCreator("recetorium:server:error");

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
