import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import imagePath from "../../../utils/images/imagePath.js";
import imageValidation from "../../../utils/images/imageValidation.js";
import {
  createRecipe,
  searchRecipes,
} from "../../controllers/recipesControllers/recipesControllers.js";
import imageResize from "../../middleware/images/resize/imageResize.js";
import createRecipesValidation from "../../middleware/validation/createRecipesValidation.js";
import searchRecipesValidation from "../../middleware/validation/searchRecipesValidation.js";

// eslint-disable-next-line new-cap
const recipesRouter = express.Router();
const upload = multer({
  dest: path.join(imagePath.base, imagePath.recipesFolder),
  fileFilter: imageValidation,
  limits: {
    fileSize: 2097152,
  },
});

recipesRouter.get(
  "/search",
  validate(searchRecipesValidation, {}, { abortEarly: false }),
  searchRecipes
);

recipesRouter.post(
  "/create",
  upload.single("image"),
  validate(createRecipesValidation, {}, { abortEarly: false }),
  imageResize,
  createRecipe
);

export default recipesRouter;
