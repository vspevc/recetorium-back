import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User/User";
import { bobUser } from "../../../factories/userFactory/userFactory";
import { registerUser } from "./usersControllers";

describe("Given a registerUser controller", () => {
  const { username, password, email } = bobUser;
  const req: Partial<Request> = {
    body: {
      username,
      password,
      email,
    },
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: NextFunction = jest.fn();

  describe("When it receives username 'Bob', a valid password and email 'bob@this.com'", () => {
    test("Then it should call it's methods status with 201 and json with 'User Bob was registered successfully.'", async () => {
      User.create = jest.fn().mockReturnValue(bobUser);
      const expectedStatus = 201;
      const expectedJson = {
        message: `User ${username} was registered successfully.`,
      };

      await registerUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives an already registered user", () => {
    test("Then it should call it's method next with the error.", async () => {
      User.create = jest.fn().mockImplementation(() => {
        throw new Error("error");
      });

      await registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
