import express from "express";
import { validate } from "express-validation";
import { searchRecipes } from "../../controllers/recipesControllers/recipesControllers.js";
import searchRecipesValidation from "../../middleware/validation/searchRecipesValidation.js";

// eslint-disable-next-line new-cap
const recipesRouter = express.Router();

recipesRouter.get(
  "/search",
  validate(searchRecipesValidation, {}, { abortEarly: false }),
  searchRecipes
);

export default recipesRouter;
