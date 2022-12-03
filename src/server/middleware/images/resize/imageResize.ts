import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import serverCustomErrors from "../../../../CustomError/serverErrorMessages.js";
import imagePath from "../../../../utils/images/imagePath.js";
import type { CreateRecipeBody } from "../../../controllers/recipesControllers/types.js";

const imageResize = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateRecipeBody
  >,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const { filename, originalname } = req.file;

  const timestamp = Date.now();
  const uniqueImageName = originalname.replace(/(\.\w+)$/i, `-${timestamp}`);
  const newImageName = `${uniqueImageName}.webp`;

  const filePath = path.join(imagePath.base, imagePath.recipesFolder);

  try {
    await sharp(path.join(filePath, filename))
      .resize(370, 240, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join(filePath, newImageName));

    await fs.rm(path.join(filePath, filename));

    req.file.filename = newImageName;
    req.file.originalname = newImageName;

    next();
  } catch (error: unknown) {
    const { cannotProcesImage } = serverCustomErrors;
    const { message, publicMessage, statusCode } = cannotProcesImage(
      (error as Error).message
    );
    const customError = new CustomError(message, publicMessage, statusCode);
    next(customError);
  }
};

export default imageResize;
