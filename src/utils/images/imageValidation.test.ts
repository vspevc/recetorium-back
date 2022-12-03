import type { Request } from "express";
import imageValidation from "./imageValidation";

describe("Given an imageValidation funtion", () => {
  const req: Partial<Request> = {
    body: {
      image: null,
    },
  };
  const callback = jest.fn();
  const expectedCallbackError: Error = null;

  describe("When it's invoked with a valid file extension 'jpg' and mimetype 'jpeg'", () => {
    test("Then it should set req.body.image to true and call it's callback with null, and true", () => {
      const file: Partial<Express.Multer.File> = {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
      };
      const expectedCallbackAcceptFile = true;
      const expectedBodyImage = true;

      imageValidation(req as Request, file as Express.Multer.File, callback);

      expect(req.body.image).toBe(expectedBodyImage);
      expect(callback).toHaveBeenCalledWith(
        expectedCallbackError,
        expectedCallbackAcceptFile
      );
    });
  });

  describe("When it's invoked with invalid file extension 'zip'", () => {
    test("Then it should set req.body.image to false and call it's callback with null, and false", () => {
      const file: Partial<Express.Multer.File> = {
        originalname: "image.zip",
        mimetype: "image/jpeg",
      };
      const expectedCallbackAcceptFile = false;
      const expectedBodyImage = false;

      imageValidation(req as Request, file as Express.Multer.File, callback);

      expect(req.body.image).toBe(expectedBodyImage);
      expect(callback).toHaveBeenCalledWith(
        expectedCallbackError,
        expectedCallbackAcceptFile
      );
    });
  });

  describe("When it's invoked with invalid file mimetype 'audio/webm'", () => {
    test("Then it should set req.body.image to false and call it's callback with null, and false", () => {
      const file: Partial<Express.Multer.File> = {
        originalname: "image.jpg",
        mimetype: "audio/webm",
      };
      const expectedCallbackAcceptFile = false;
      const expectedBodyImage = false;

      imageValidation(req as Request, file as Express.Multer.File, callback);

      expect(req.body.image).toBe(expectedBodyImage);
      expect(callback).toHaveBeenCalledWith(
        expectedCallbackError,
        expectedCallbackAcceptFile
      );
    });
  });

  describe("When it's invoked with no file", () => {
    test("Then it should set req.body.image to false and call it's callback with null, and false", () => {
      const file: Partial<Express.Multer.File> = null;
      const expectedCallbackAcceptFile = false;
      const expectedBodyImage = true;

      imageValidation(req as Request, file as Express.Multer.File, callback);

      expect(req.body.image).toBe(expectedBodyImage);
      expect(callback).toHaveBeenCalledWith(
        expectedCallbackError,
        expectedCallbackAcceptFile
      );
    });
  });
});
