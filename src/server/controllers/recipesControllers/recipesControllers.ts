import type { NextFunction, Request, Response } from "express";
import Recipe from "../../../database/models/Recipe/Recipe.js";
import {
  getPagination,
  paginationDefaults,
} from "../../../utils/pagination/getPagination.js";
import slugify from "../../../utils/slug/slugify.js";
import type {
  CreateRecipeBody,
  RecipeStructure,
  SearchRecipeBody,
  SearchRecipeFilter,
  SearchRecipeParams,
} from "./types.js";

export const searchRecipes = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    SearchRecipeBody,
    SearchRecipeParams
  >,
  res: Response,
  next: NextFunction
) => {
  const { name, types } = req.body;

  const filter: SearchRecipeFilter = {};
  if (name) {
    filter.name = RegExp(name, "i");
  }

  if (types) {
    filter.types = { $elemMatch: { ...types } };
  }

  try {
    const { firstPage, perPage: perPageDefault } = paginationDefaults;
    const {
      page: currentPage = firstPage,
      "per-page": perPage = perPageDefault,
    } = req.query;
    const firstItem = (currentPage - 1) * perPage;

    const recipes = await Recipe.find(filter)
      .skip(firstItem)
      .limit(perPage)
      .exec();
    const count = await Recipe.find(filter).count().exec();

    const [previousPage, nextPage] = getPagination({
      path: `${req.baseUrl}${req.path}`,
      totalItems: count,
      currentPage,
      perPage,
    });

    const totalPages = Math.ceil(count / perPage);

    res.status(200).json({ previousPage, nextPage, totalPages, recipes });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const createRecipe = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateRecipeBody
  >,
  res: Response,
  next: NextFunction
) => {
  const { name, author, types, ingredients, steps, elaborationTime } = req.body;

  const timestamp = Date.now();
  const urlSlug = `${timestamp}/${slugify(name)}`;

  const { file } = req;
  const recipeImageName = file ? file.filename : "default.webp";

  const backupImage = recipeImageName;

  const recipe: RecipeStructure = {
    name,
    author,
    types,
    ingredients,
    steps,
    elaborationTime,
    urlSlug,
    image: recipeImageName,
    backupImage,
  };

  try {
    await Recipe.create(recipe);

    res
      .status(201)
      .json({ message: `Recipe "${name}" was created successfully` });
  } catch (error: unknown) {
    next(error as Error);
  }
};
