import type { NextFunction, Request, Response } from "express";
import Recipe from "../../../database/models/Recipe/Recipe.js";
import {
  getPagination,
  paginationDefaults,
} from "../../../utils/pagination/getPagination.js";
import type {
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

    const [previuosPage, nextPage] = getPagination({
      path: req.path,
      totalItems: count,
      currentPage,
      perPage,
    });

    const totalPages = Math.ceil(count / perPage);

    res.status(200).json({ previuosPage, nextPage, totalPages, recipes });
  } catch (error: unknown) {
    next(error as Error);
  }
};
