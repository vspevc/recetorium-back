import type { NextFunction, Request, Response } from "express";
import type { RegisterUserBody } from "./types";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User/User.js";

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
    next(error as Error);
  }
};
