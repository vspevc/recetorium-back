import type { NextFunction, Request } from "express";
import fs from "fs/promises";
import CustomError from "../../../../CustomError/CustomError";
import serverCustomErrors from "../../../../CustomError/serverErrorMessages";
import bucket from "../../../../utils/supabaseConfig";
import imageBackup from "./imageBackup";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given an imageBackup middleware", () => {
  const imageName = "image.webp";
  const file: Partial<Express.Multer.File> = {
    filename: imageName,
  };
  const req: Partial<Request> = {
    body: {
      imageBackup: null,
    },
    file: file as Express.Multer.File,
  };
  const next: NextFunction = jest.fn();
  fs.readFile = jest.fn();

  describe("When it receives a request with file 'image.webp'", () => {
    test("Then it should set body backupimage to 'backup/image.webp' and call next", async () => {
      const expectedBackupImage = `backup/${imageName}`;
      bucket.upload = jest.fn();
      bucket.getPublicUrl = jest
        .fn()
        .mockReturnValue({ data: { publicUrl: expectedBackupImage } });

      await imageBackup(req as Request, null, next);

      expect(req.body.backupImage).toBe(expectedBackupImage);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a file but upload fails", () => {
    test("Then it should call next with error 'Cannot upload image'", async () => {
      const errorMessage = "Cannot upload image";
      const { cannotUploadImage } = serverCustomErrors;
      const { message, publicMessage, statusCode } =
        cannotUploadImage(errorMessage);
      const expectedError = new CustomError(message, publicMessage, statusCode);
      bucket.upload = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await imageBackup(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request without a file", () => {
    test("Then it should call next", async () => {
      req.file = null;

      await imageBackup(req as Request, null, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
