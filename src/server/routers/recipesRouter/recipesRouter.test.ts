import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import databaseConnect from "../../../database/databaseConnection";
import Recipe from "../../../database/models/Recipe/Recipe";
import {
  recipeList,
  recipeTomatoSoup,
} from "../../../factories/recipeFactory/recipeFactory";
import { paginationDefaults } from "../../../utils/pagination/getPagination";
import app from "../../app";
import type { RecipeStructure } from "../../controllers/recipesControllers/types";

let databaseServer: MongoMemoryServer;

beforeAll(async () => {
  databaseServer = await MongoMemoryServer.create();
  await databaseConnect(databaseServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await databaseServer.stop();
});

afterEach(async () => {
  await Recipe.deleteMany({});
});

describe("Given an endpoit GET /recipes/search", () => {
  const { perPage } = paginationDefaults;
  const path = "/recipes/search";

  describe("When it receives a request without body neither query", () => {
    test("Then it should send with status code 200 and previousPage 'null'", async () => {
      const expectedStatus = 200;
      const expectedRecipes = recipeList(perPage);
      const recipes = [...expectedRecipes, ...recipeList(20)];
      const recipesCount = recipes.length;
      const previousPage = null as string;
      const nextPage = `${path}?page=2`;
      const totalPages = Math.ceil(recipesCount / perPage);
      await Recipe.insertMany(recipes);

      const response: {
        body: {
          previousPage: string;
          nextPage: string;
          totalPages: number;
          recipes: RecipeStructure[];
        };
      } = await request(app).get(path).expect(expectedStatus);
      const {
        previousPage: bodyPreviousPage,
        nextPage: bodyNextPage,
        totalPages: bodyTotalPages,
        recipes: bodyRecipes,
      } = response.body;

      expect(bodyPreviousPage).toStrictEqual(previousPage);
      expect(bodyNextPage).toStrictEqual(nextPage);
      expect(bodyTotalPages).toBe(totalPages);
      expect(bodyRecipes).toHaveLength(perPage);
    });
  });

  describe("When it receives a request with body name 'tomato soup'", () => {
    test("Then it should send a response with status 200 and a list with only 'Tomato soup' recipe", async () => {
      const expectedStatus = 200;
      const expectedRecipe = recipeTomatoSoup;
      const expectedRecipesLength = 1;
      const requestName = { name: "tomato soup" };
      const recipes = [...recipeList(20), expectedRecipe];
      await Recipe.insertMany(recipes);

      const response: {
        body: {
          recipes: RecipeStructure[];
        };
      } = await request(app).get(path).send(requestName).expect(expectedStatus);
      const { recipes: bodyRecipes } = response.body;

      expect(bodyRecipes).toHaveLength(expectedRecipesLength);
      expect(bodyRecipes[0].name).toMatch(RegExp(requestName.name, "i"));
    });
  });
});
