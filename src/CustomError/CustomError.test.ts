import CustomError from "./CustomError";
import type CustomErrorStructure from "./types";

describe("Given CustomError class", () => {
  describe("When it's instantiated with message 'Server error', public message 'Internal server error' and statusCode 500", () => {
    test("Then it should return an object istance of Error with those properties and values", () => {
      const expecterError: CustomErrorStructure = {
        message: "Server error",
        publicMessage: "Internal server error",
        statusCode: 500,
      };
      const [message, publicMessage, statusCode] = Object.keys(expecterError);

      const error = new CustomError(
        expecterError.message,
        expecterError.publicMessage,
        expecterError.statusCode
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(message, expecterError.message);
      expect(error).toHaveProperty(publicMessage, expecterError.publicMessage);
      expect(error).toHaveProperty(statusCode, expecterError.statusCode);
    });
  });
});
