import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { ValidationError } from "express-validation";
import type { ValidationError as JoiError } from "joi";
import CustomError from "../../../CustomError/CustomError";
import serverCustomErrors from "../../../CustomError/serverErrorMessages";
import type CustomErrorStructure from "../../../CustomError/types";
import { errorHandler, notFoundError } from "./errors";

afterEach(() => jest.clearAllMocks());

const { notFoundErrorMessage, unknownServerErrorMessage } = serverCustomErrors;

describe("Given a errorHandler middleware", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives an error with message `I'm a teapot`, public message `I'm a teapot` and status code 418", () => {
    test("Then it should send a response with status 418 and error: 'I'm a teapot'", () => {
      const error: CustomErrorStructure = {
        message: "I'm a teapot",
        publicMessage: "I'm a teapot",
        statusCode: 418,
      };
      const expectedJson = { error: error.publicMessage };

      errorHandler(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives an error with message 'Server error' but no public message neither status code", () => {
    test("Then it should send a response with status 500 and error: 'Internal server error'", () => {
      const error = { message: "Server error" };
      const expectedStatusCode = 500;
      const expectedJson = { error: unknownServerErrorMessage };

      errorHandler(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives an error instance of MongoServerError with code 11000", () => {
    test("Then it should send a respones with status 400 and error: 'User already exists.'", () => {
      const error = new MongoServerError({ message: "MongoServerError" });
      error.code = 11000;
      const expectedStatusCode = 400;
      const expectedJson = { error: "User already exists." };

      errorHandler(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives an error instance of ValidationError at body and query", () => {
    test("Then it should send a response with status code 400 and error: 'Joi validation error'", () => {
      const error = new ValidationError({}, {});
      const errorMessage: JoiError = {
        name: "ValidationError",
        isJoi: true,
        details: [
          {
            message: "Joi validation error",
            path: [],
            type: "string",
          },
        ],
        message: "Joi validation error",
        annotate: () => "string",
        _original: "any",
      };
      error.details.body = [errorMessage];
      error.details.query = [errorMessage];
      const expectedStatusCode = 400;

      errorHandler(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });
});

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request with path '/not-an-endpoint", () => {
    test("Then it should call next with an Error: message 'Endpoint not found: /not-an-endpoint', publicMessage 'Endpoint not found' and statusCode 404", () => {
      const expectedPath = "/not-an-endpoint";
      const { message, publicMessage, statusCode } =
        notFoundErrorMessage(expectedPath);
      const expectedError = new CustomError(message, publicMessage, statusCode);
      const req: Partial<Request> = {
        path: expectedPath,
      };
      const next = jest.fn();

      notFoundError(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
