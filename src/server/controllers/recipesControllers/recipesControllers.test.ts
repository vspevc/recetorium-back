import type { NextFunction, Request, Response } from "express";
import Recipe from "../../../database/models/Recipe/Recipe";
import {
  recipeList,
  recipeTomatoSoup,
} from "../../../factories/recipeFactory/recipeFactory";
import { paginationDefaults } from "../../../utils/pagination/getPagination";
import { createRecipe, searchRecipes } from "./recipesControllers";
import type {
  CreateRecipeBody,
  RecipeStructure,
  SearchRecipeBody,
  SearchRecipeParams,
} from "./types";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next: NextFunction = jest.fn();

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
    protocol: "http",
    get: jest.fn().mockReturnValue("loacalhost"),
  };

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
    test("Then it should call response methods status with 200 and json with only recipeTomatoSoup", async () => {
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

describe("Given a createRecipe controller", () => {
  const { name, author, types, ingredients, steps, elaborationTime } =
    recipeTomatoSoup;
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, CreateRecipeBody>
  > = {
    body: {
      name,
      author,
      types,
      ingredients,
      steps,
      elaborationTime,
    },
  };

  describe("When it receives a request with valid recipe name 'Tomato soup' and image 'tomato-soup.jpg'", () => {
    test("Then it should call response methods status with 201 and json with 'Recipe `Tomato soup` was created successfully'", async () => {
      const file: Partial<Express.Multer.File> = {
        filename: "hasedfilename",
        originalname: "tomato-soup",
      };
      req.file = file as Express.Multer.File;
      const expectedStatus = 201;
      const expectedJson = {
        message: 'Recipe "Tomato soup" was created successfully',
      };
      Recipe.create = jest.fn().mockReturnValue(recipeTomatoSoup);

      await createRecipe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives a request with valid recipe name 'Tomato soup' and without image", () => {
    test("Then it should call response methods status with 201 and json with 'Recipe `Tomato soup` was created successfully'", async () => {
      req.file = null;
      const expectedStatus = 201;
      const expectedJson = {
        message: 'Recipe "Tomato soup" was created successfully',
      };
      Recipe.create = jest.fn().mockReturnValue(recipeTomatoSoup);

      await createRecipe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it receives a request with duplicated recipe name 'Tomato soup' and without image", () => {
    test("Then it should call next with an error", async () => {
      Recipe.create = jest.fn().mockImplementation(() => {
        throw new Error("error");
      });

      await createRecipe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
