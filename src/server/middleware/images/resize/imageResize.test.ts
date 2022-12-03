import type { NextFunction, Request } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../../../CustomError/CustomError";
import serverCustomErrors from "../../../../CustomError/serverErrorMessages";
import imagePath from "../../../../utils/images/imagePath";
import imageResize from "./imageResize";

let mockSharp = jest.fn();
jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockSharp,
      }),
    }),
  }),
}));
jest.useFakeTimers().setSystemTime(new Date("1982-01-19"));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given an imageResize middleware", () => {
  const file: Partial<Express.Multer.File> = {
    filename: "hasedfilename",
    originalname: "image.jpg",
  };
  const req: Partial<Request> = {
    file: file as Express.Multer.File,
  };
  const next: NextFunction = jest.fn();

  describe("When it receives a request with file 'image.jpg'", () => {
    test("Then it should set file filename to 'image-380246400000.webp'", async () => {
      const filePath = path.join(imagePath.base, imagePath.recipesFolder);
      fs.rm = jest.fn().mockReturnValue(path.join(filePath, "hasedfilename"));
      const expectedImageName = "image-380246400000.webp";

      await imageResize(req as Request, null, next);

      expect(req.file.filename).toBe(expectedImageName);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file but it fails processing the image", () => {
    test("Then it should call next with error 'Cannot process image'", async () => {
      const errorMessage = "Cannot process image";
      const { cannotProcesImage } = serverCustomErrors;
      const { message, publicMessage, statusCode } =
        cannotProcesImage(errorMessage);
      const expectedError = new CustomError(message, publicMessage, statusCode);
      mockSharp = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await imageResize(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request without a file", () => {
    test("Then it should call next", async () => {
      req.file = null;

      await imageResize(req as Request, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
