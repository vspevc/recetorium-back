import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../../../CustomError/CustomError.js";
import serverCustomErrors from "../../../../CustomError/serverErrorMessages.js";
import imagePath from "../../../../utils/images/imagePath.js";
import bucket from "../../../../utils/supabaseConfig.js";
import type { CreateRecipeBody } from "../../../controllers/recipesControllers/types.js";

const imageBackup = async (
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

  const { filename } = req.file;
  const image = path.join(imagePath.base, imagePath.recipesFolder, filename);

  try {
    const imageBuffer = await fs.readFile(image);

    await bucket.upload(filename, imageBuffer);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(filename);

    req.body.backupImage = publicUrl;

    next();
  } catch (error: unknown) {
    const { cannotUploadImage } = serverCustomErrors;
    const { message, publicMessage, statusCode } = cannotUploadImage(
      (error as Error).message
    );
    const customError = new CustomError(message, publicMessage, statusCode);

    next(customError);
  }
};

export default imageBackup;
