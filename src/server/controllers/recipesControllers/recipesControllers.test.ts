import type { NextFunction, Request, Response } from "express";
import Recipe from "../../../database/models/Recipe/Recipe";
import {
  recipeList,
  recipeTomatoSoup,
} from "../../../factories/recipeFactory/recipeFactory";
import { paginationDefaults } from "../../../utils/pagination/getPagination";
import { searchRecipes } from "./recipesControllers";
import type {
  RecipeStructure,
  SearchRecipeBody,
  SearchRecipeParams,
} from "./types";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a searchRecipes controller", () => {
  const req: Partial<
    Request<
      Record<string, unknown>,
      Record<string, unknown>,
      SearchRecipeBody,
      SearchRecipeParams
    >
  > = {
    body: {},
    query: {},
    baseUrl: "/recipes",
    path: "/search",
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: NextFunction = jest.fn();

  describe("When it receives a request without body neither params", () => {
    test("Then it should call response methods status with 200 and json with recipes with 8 recipes", async () => {
      const randomRecipes = recipeList(8);
      const mockRecipes: RecipeStructure[] = [
        ...randomRecipes,
        recipeTomatoSoup,
      ];
      Recipe.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(randomRecipes),
          }),
        }),
        count: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(mockRecipes.length),
        }),
      });
      const previousPage = null as string;
      const nextPage = `${req.baseUrl}${req.path}?page=2`;
      const totalPages = Math.ceil(
        mockRecipes.length / paginationDefaults.perPage
      );
      const expectedJsonResponse = {
        previousPage,
        nextPage,
        totalPages,
        recipes: randomRecipes,
      };

      await searchRecipes(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          SearchRecipeBody,
          SearchRecipeParams
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives body name 'Tomato soup' and types names 'comida' and 'cena'", () => {
    test("Then it should call response methods status with 200 and json with recipes with only recipeTomatoSoup", async () => {
      req.body.name = "comida";
      req.body.types = [{ name: "comida" }, { name: "cena" }];
      const expectedRecipe = [recipeTomatoSoup];
      Recipe.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(expectedRecipe),
          }),
        }),
        count: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(expectedRecipe.length),
        }),
      });
      const previousPage = null as string;
      const nextPage = null as string;
      const totalPages = Math.ceil(
        expectedRecipe.length / paginationDefaults.perPage
      );
      const expectedJsonResponse = {
        previousPage,
        nextPage,
        totalPages,
        recipes: expectedRecipe,
      };

      await searchRecipes(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          SearchRecipeBody,
          SearchRecipeParams
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request but there's a error when searching", () => {
    test("Then it should call it's method next with an error", async () => {
      Recipe.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockImplementation(() => {
              throw new Error("error");
            }),
          }),
        }),
      });

      await searchRecipes(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          SearchRecipeBody,
          SearchRecipeParams
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
