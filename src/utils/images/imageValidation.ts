import type { Request } from "express";
import type multer from "multer";

const imageValidation = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  req.body.image = true;

  if (!file) {
    callback(null, false);
    return;
  }

  const { mimetype, originalname } = file;

  if (
    !/((?:.png$|.jpg$|.jpeg$|.avif$|.webp$))/.test(originalname) ||
    !/((?:png$|jpeg$|avif$|webp$))/.test(mimetype)
  ) {
    req.body.image = false;
    callback(null, false);
    return;
  }

  callback(null, true);
};

export default imageValidation;
