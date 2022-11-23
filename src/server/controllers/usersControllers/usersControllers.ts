import type { NextFunction, Request, Response } from "express";
import type { RegisterUserBody } from "./types";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import { MongoServerError } from "mongodb";

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RegisterUserBody
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res
      .status(201)
      .json({ message: `User ${user.username} was registered successfully.` });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    let publicMessage = "Cannot register user, try again later.";
    let statusCode = 500;

    if (error instanceof MongoServerError && error.code === 11000) {
      publicMessage = "User already exists.";
      statusCode = 400;
    }

    const customError = new CustomError(
      errorMessage,
      publicMessage,
      statusCode
    );

    next(customError);
  }
};
